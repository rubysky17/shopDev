# Sử dụng một hình ảnh base có sẵn từ Docker Hub
FROM mongo:latest

# Tùy chỉnh cấu hình nếu cần thiết
# Ví dụ: COPY my-custom-mongod.conf /etc/mongod.conf

# Mở cổng MongoDB mặc định
EXPOSE 27017

# Khởi động MongoDB khi container được chạy
CMD ["mongod"]
