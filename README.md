# Các bước để chạy project

## Lưu ý

- Môi trường dev sẽ sử dụng .env.dev, môi trường prod sẽ sử dụng .env.prod. Template của file .env sẽ nằm trong .env.example. Khi chạy migrate hiện mới chỉ hỗ trợ môi trường dev.
- Sau khi chạy api thành công, hãy vào endpoint `/docs` để đọc biết thêm chi tiết.

## Setup Google Cloud Console

1. Vào một project trên Google Cloud Console (hoặc tạo mới) và bật Google People API.
2. Vào "APIs & Services" > "Credentials" > "Create Credentials" > OAuth Client ID.
3. Làm các bước yêu cầu để có thể tạo OAuth Client ID, nhớ trong đó có cả endpoint để callback.
4. Thêm `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` và `CALLBACK_URL` vào trong .env. (`CALLBACK_URL` phải có dạng `"${base_url}/v1/auth/google/callback"`)

## Setup ChatCore

1. Thực hiện hướng dẫn trong README.md của [NguyenHuuViet322/ChatbotCore](https://github.com/NguyenHuuViet322/ChatbotCore)
2. Thêm `CHATCORE_URL` vào trong .env.

## Setup Project

1. Tạo database mới (MYSQL)
2. Thêm `DATABASE_URL` vào trong .env.
3. Thêm nốt các giá trị còn lại của .env (Tham khảo .env.example)
4. Install các dependencies rồi migrate database bằng cách chạy lệnh sau.

```
yarn && yarn migration:run
```

## Run Project

1. Chạy project bằng cách thực hiện một trong các lệnh sau.

```
yarn dev
yarn prod
```
