'use strict';

const redis = require('redis')
const { promisify } = require('util');

const redisClient = redis.createClient;

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cardId) => {
    const key = `lock_v2024_${productId}`;

    const retryTimes = 10; // CHo phép thử lại 10 lần
    const expireTime = 1000 * 3 // tạm lock 3s

    for (let i = 0; i < retryTimes.length; i++) {
        // Tạo 1 key, ai có key sẽ được vào thanh toán
        const result = await setnxAsync(key, expireTime);

        console.log(`result::: `, result);

        if (result === 1) {
            // Thao tác với inventory

            const isReservation = await reservationInventory({
                productId, quantity, cardId
            });

            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime)

                return key;

            }

            return null;
        } else {
            // * Thử lại 10 lần , mỗi lẩn cách nhau 300 ms
            await new Promise((resolve) => setTimeout(() => {
                resolve
            }, 300))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);

    return await delAsyncKey(keyLock)
}

module.exports = {
    releaseLock,
    acquireLock
}