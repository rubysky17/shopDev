Redis là gì ?
- Research ???

Tại sao lại sử dụng Redis ?
- Vì hiệu suất cao và đồng thời cao. Vậy hiệu suất cao là gì? và đồng thời cao là gì ?
- Hiệu suất cao ví dụ người dùng truy cập 1 số dữ liệu của CSDL quá trình này chậm vì nó đọc từ đĩa cứng, do đó lần tiếp theo dữ liệu được truy cấp nó lấy từ bộ đệm => Lấy từ Cache
- Tính đồng thời cao là các yêu cầu bộ đệm hoạt động trực tiếp có thể chịu được bao nhiêu so với truy cập vào CSDL, để người dùng có thể truy cập thông qua bộ đệm mà không cần thông qua CSDL.

3. memcached vs redis ?
- Redis hỗ trợ nhiều loại dữ liệu hơn, memecached chỉ hỗ trợ string.
- memcached không có chế động cluster
- Đa luồng và đơn luồng (memcached đa luồng còn redis đơn luồng).

4. Redis có bao nhiu KDL? kịch bản
String: get, set, mget, mset
để làm bộ đệm, bộ đếm, like, 
Hash: hget, hset, hgetall
là 1 bản ánh xạ giữa các trường và các kiểu, chuỗi, có thể thay đổi trực tiếp trên trường đối tượng nah61t định: thông tin người dùng, ....

