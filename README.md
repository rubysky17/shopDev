# Các câu hỏi liên quan đến Redis

## 1. Redis là gì ?
- Research ???

### 2. Tại sao lại sử dụng Redis ?
- Vì hiệu suất cao và đồng thời cao. Vậy hiệu suất cao là gì? và đồng thời cao là gì ?
- Hiệu suất cao ví dụ người dùng truy cập 1 số dữ liệu của CSDL quá trình này chậm vì nó đọc từ đĩa cứng, do đó lần tiếp theo dữ liệu được truy cấp nó lấy từ bộ đệm => Lấy từ Cache
- Tính đồng thời cao là các yêu cầu bộ đệm hoạt động trực tiếp có thể chịu được bao nhiêu so với truy cập vào CSDL, để người dùng có thể truy cập thông qua bộ đệm mà không cần thông qua CSDL.

### 3. memcached vs redis ?
- Redis hỗ trợ nhiều loại dữ liệu hơn, memecached chỉ hỗ trợ string.
- memcached không có chế động cluster
- Đa luồng và đơn luồng (memcached đa luồng còn redis đơn luồng).

### 4. Redis có bao nhiu KDL? kịch bản
- String: get, set, mget, mset
để làm bộ đệm, bộ đếm, like, 
- Hash: hget, hset, hgetall
là 1 bản ánh xạ giữa các trường và các kiểu, chuỗi, có thể thay đổi trực tiếp trên trường đối tượng nah61t định: thông tin người dùng,....
- List: RPUSH, Lput, lpost, lrange
có cấu trúc quan trọng nhất khi sử dụng redis
danh sách follow của fb, follower

Còn nữa...
### 5. Redis giải quyết cơ chế hết hạn dữ liệu ntn ?
- Chạy bằng lệnh

***

# String
**Gồm 3 loại**
1. embstr (< 44 byte)
2. raw (> 44 byte)
3. int (Int) - Số nguyên

- VD: 
```javascript
SET str <Chuỗi gồm 44 ký tự>
object encoding str // => embstr

SET str1 <Chuỗi lớn hơn 44 ký tự>
object encoding str1 // => raw

SET num <dãy số int>
object encoding num // => int
```

**Các lệnh thao tác với String**
```javascript
SET <key> <value> // gán giá trị cho key
GET <key> // lấy giá trị theo key
EXISTS <key> // Kiểm tra key có tồn tại hay không ? 0 là không tồn tại, 1 là tồn tại
STRLEN <key> // Kiểm tra độ dài của String
DEL <key> // Xoá key => 1 xoá thành công, 0 xoá thất bại
MSET <key1> <value1> <key2> <value2> // Gán hàng loạt
MGET <key1> <key2>  // Lấy hàng loạt
INCR <key> // Tăng giá trị của key lên 1
INCRBY <key> <value> // Tăng giá trị của key cộng với <value>
DECR <key> // Giảm giá trị của key lên 1
DECRBY <key> <value> // Giảm giá trị của key trừ thêm <value>
KEYS '<key>*' // Tìm kiếm tất cả các key
EXPIRE <key> <value> // Set thời gian key hết hạn theo <value> (đơn vị là giây)
TTL <key> // Trả về thời gian key còn sống (đơn vị là giây)
SET <key> <value> EX <time> // Set giá trị và set time expire
SETNX <key> <value1> // Nếu key tồn tại thì sẽ không set
MSET <key1>:<property1> <value1> <key2>:<property2> <value2> // set giá trị theo thuộc tính
MGET <key1>:<property1> <key2>:<property2> // get giá trị theo thuộc tính
``` 
**Nên sử dụng String cho nghiệp vụ đếm hoặc tính số lượng: Đếm likes, đếm bài viết,....**

# Hash
**Có thể lưu trữ nhiều trường, nhiều kiểu dữ liệu khác nhau. Ưu tiên lưu trữ Object**

```javascript
HSET <key> <property1> <value1> <property2> <value2> .... // SET key cho nhiều property với nhiều value
HGET <key> <tên property1> // GET giá trị của property của key
HMSET <key> <property1> <value1> <property2> <value2> .... // SET key cho nhiều property với nhiều value
HMGET <key> <tên property1> <tên property2> // GET giá trị của property của key
HDEL <key> <tên property1> // Xoá 1 trường của key
HLEN <key> // trả về giá trị độ dài của key
HGETALL <key> // Trả về tất cả các trường của key
HEXISTS <key> // Kiểm tra tồn tại
HINCRBY <key> <tên property1> <value> // Tăng giá trị của trường
HKEYS <key> // trả về tất cả thuộc tính của key
HVALS <key> // trả về tất cả giá trị của key
```