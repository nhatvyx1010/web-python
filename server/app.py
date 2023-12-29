from flask import Flask, render_template, flash, redirect, url_for, request, jsonify, session, abort
from functools import wraps
from datetime import datetime
import pymysql, random, os
from flask_cors import CORS
from base64 import b64encode
import jwt

app = Flask(__name__)
CORS(app)

app.secret_key = 'my_secret_key'

app.config['SECRET_KEY'] = 'your_secret_key_here'

app.config['MYSQL_HOST'] = "localhost"
app.config['MYSQL_USER'] = "root"
app.config['MYSQL_PASSWORD'] = ""
app.config['MYSQL_DB'] = "hk5_python_prj"

UPLOAD_FOLDER = 'static/images'  # Đường dẫn thư mục lưu trữ hình ảnh
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# mysql = pymysql.connect(
#     host=app.config['MYSQL_HOST'],
#     user=app.config['MYSQL_USER'],
#     password=app.config['MYSQL_PASSWORD'],
#     db=app.config['MYSQL_DB']
# )

def connect_to_db():
    return pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB']
    )

def generate_random_user_id():
    random_number = random.randint(0, 999999)
    user_id = f"us{random_number:06d}"
    return user_id
def generate_random_sanpham_id():
    random_number = random.randint(0, 999999)
    user_id = f"sp{random_number:06d}"
    return user_id
def generate_random_nhanvien_id():
    random_number = random.randint(0, 999999)
    user_id = f"nv{random_number:06d}"
    return user_id
def generate_random_khachhang_id():
    random_number = random.randint(0, 999999)
    user_id = f"kh{random_number:06d}"
    return user_id
def generate_random_donhang_id():
    random_number = random.randint(0, 999999)
    user_id = f"dh{random_number:06d}"
    return user_id
def generate_random_danhmuc_id():
    random_number = random.randint(0, 999999)
    user_id = f"dm{random_number:06d}"
    return user_id
def generate_random_chitietdonhang_id():
    random_number = random.randint(0, 999999)
    user_id = f"ctdh{random_number:06d}"
    return user_id

@app.route('/')
def index():    
    return render_template('index.html')


token = None
def set_token(new_token):
    global token
    token = new_token

    
# @app.route('/api/login', methods=['POST'])
# def api_login():
#     data = request.get_json()

#     if 'Username' not in data or 'Password' not in data:
#         return jsonify({'error': 'Missing Username or Password'}), 400

#     username = data['Username']
#     password = data['Password']

#     # Thực hiện kiểm tra username và password trong CSDL
#     # Replace đoạn mã này bằng cách sử dụng thư viện ORM hoặc cách thích hợp với CSDL của bạn
#     cursor = mysql.cursor()
#     cursor.execute('SELECT * FROM user WHERE Username = %s AND Password = %s', (username, password))
#     user = cursor.fetchone()
#     cursor.close()

#     if user:
#         user_id = user[0]  # Lấy ID của user từ DB
#         if user[3] == 'admin':
#             return jsonify({'token': 'admin', 'user_id': user_id})
#         elif user[3] == 'user':
#             return jsonify({'token': 'user', 'user_id': user_id})
    
#     return jsonify({'error': 'Invalid credentials or insufficient permissions'}), 401
# app.config['SECRET_KEY'] = 'your_secret_key_here'
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    if 'Username' not in data or 'Password' not in data:
        return jsonify({'error': 'Missing Username or Password'}), 400

    username = data['Username']
    password = data['Password']

    # Thực hiện kiểm tra username và password trong CSDL
    # Replace đoạn mã này bằng cách sử dụng thư viện ORM hoặc cách thích hợp với CSDL của bạn
    
    connection = connect_to_db()
    cursor = connection.cursor()
    
    cursor.execute('SELECT * FROM user WHERE Username = %s AND Password = %s', (username, password))
    user = cursor.fetchone()
    
    cursor.close()
    connection.close()

    if user:
        user_id = user[0] # Lấy ID của user từ DB
        role = user[3] # Lấy vai trò của user từ DB

        # Tạo token
        # token = jwt.encode({'role': role}, app.config['SECRET_KEY'])
        token = jwt.encode({'role': role, 'user_id': user_id}, app.config['SECRET_KEY'], algorithm='HS256')
        set_token(token)
        return jsonify({'status': 200, 'token': token, 'user_id': user_id})
    else:
        return jsonify({'error': 'Invalid credentials or insufficient permissions'}), 401


 
# Hàm decorator để kiểm tra quyền admin
def check_admin_permission():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Thực hiện kiểm tra quyền admin
            # Thay thế đoạn mã này bằng cách sử dụng session hoặc cách xác thực phù hợp với ứng dụng của bạn
            if 'user' not in session or session['user']['Role'] != 'admin':
                return jsonify({'error': 'Unauthorized'}), 403

            return func(*args, **kwargs)

        return wrapper

    return decorator

# Sử dụng decorator cho API cần kiểm tra quyền admin
@app.route('/api/user_index', methods=['GET'])
@check_admin_permission()
def api_user_index():
    
    connection = connect_to_db()
    cursor = connection.cursor()
    
    cursor.execute('SELECT * FROM user')  
    users = cursor.fetchall()
    
    cursor.close()
    connection.close()

    users_list = [{'UserID': user[0], 'Username': user[1], 'Password': user[2], 'Role': user[3], 'Note': user[4]} for user in users]

    return jsonify(users_list)

# ==============================================================================================
@app.route('/management_user')
def management_user():
    return render_template('management_user.html')

@app.route('/management_nhanvien')
def management_nhanvien():
    return render_template('management_nhanvien.html')

@app.route('/management_khachhang')
def management_khachhang():
    return render_template('management_khachhang.html')

@app.route('/management_danhmuc')
def management_danhmuc():
    return render_template('management_danhmuc.html')

@app.route('/management_sanpham')
def management_sanpham():
    return render_template('management_sanpham.html')

@app.route('/management_donhang')
def management_donhang():
    return render_template('management_donhang.html')

@app.route('/management_ctdh')
def management_ctdh():
    return render_template('management_ctdh.html')

@app.route('/admin_manager')
def admin_manager():
    return render_template('admin.html')

# ==============================================================================================
@app.route('/login')
def login():    
    return render_template('login.html')

@app.route('/register')
def register():    
    return render_template('register.html')

@app.route('/register_user', methods=['POST'])
def register_user():
    if request.method == 'POST':
        data = request.json
        if 'hoten' in data and 'ngaysinh' in data and 'phone' in data and 'diachi' in data and 'ghichu' in data and 'username' in data and 'password' in data:
            # Thêm khách hàng mới vào CSDL
            khachhang_id = generate_random_khachhang_id()
            hoten = data['hoten']
            ngaysinh = data['ngaysinh']
            phone = data['phone']
            diachi = data['diachi']
            ghichu = data['ghichu']

            
            connection = connect_to_db()
            cursor = connection.cursor()
            
            cursor.execute('INSERT INTO khachhang (KhachHangID, HoTen, NgaySinh, Phone, DiaChi, GhiChu) VALUES (%s, %s, %s, %s, %s, %s)', (khachhang_id, hoten, ngaysinh, phone, diachi, ghichu))
            connection.commit()
            
            

            # Tạo người dùng mới cho khách hàng và lấy UserID vừa được tạo
            user_id = generate_random_user_id()
            username = data['username']
            password = data['password']
            role = 'user'  # Gán vai trò cho khách hàng

            cursor.execute('INSERT INTO user (UserID, Username, Password, Role, Note) VALUES (%s, %s, %s, %s, %s)', (user_id, username, password, role, f'Customer for {hoten}'))
            connection.commit()

            # Cập nhật UserID trong bảng khachhang cho khách hàng mới tạo
            cursor.execute('UPDATE khachhang SET UserID = %s WHERE KhachHangID = %s', (user_id, khachhang_id))
            connection.commit()

            
            cursor.close()
            connection.close()

            return jsonify({'message': 'Khách hàng và người dùng đã được thêm mới thành công'})
        else:
            return jsonify({'message': 'Missing or invalid data in request'})
    else:
        return jsonify({'message': 'Invalid request method'})

# ==============================================================================================

@app.route('/user_index', methods=['GET'])
def user_index():
    # Tạo kết nối mới
    connection = connect_to_db()
    cursor = connection.cursor()
    
    cursor.execute('SELECT * FROM user')
    users = cursor.fetchall()
    
    cursor.close()
    connection.close()
    
    users_list = [{'UserID': user[0], 'Username': user[1], 'Password': user[2], 'Role': user[3], 'Note': user[4]} for user in users]

    response = {'status': 200, 'users': users_list}
    return jsonify(response)

@app.route('/user_add', methods=['POST'])
def user_add():
    if request.method == 'POST':
        data = request.json
        if 'username' in data and 'password' in data and 'role' in data and 'note' in data:
            id = generate_random_user_id()
            username = data['username']
            password = data['password']
            role = data['role']
            note = data['note']

            connection = connect_to_db()
            cursor = connection.cursor()
            
            cursor.execute('INSERT INTO user (UserID, Username, Password, Role, Note) VALUES (%s, %s, %s, %s, %s)', (id, username, password, role, note))
            connection.commit()
            
            cursor.close()
            connection.close()

            return jsonify({'message': 'Người dùng đã được thêm mới thành công'})
        else:
            return jsonify({'message': 'Missing or invalid data in request'})
    else:
        return jsonify({'message': 'Invalid request method'})

@app.route('/user_update/<string:user_id>', methods=['PUT'])
def user_update(user_id):
    if request.method == 'PUT':
        data = request.json
        if 'username' in data and 'password' in data and 'role' in data and 'note' in data:
            username = data['username']
            password = data['password']
            role = data['role']
            note = data['note']

            
            connection = connect_to_db()
            cursor = connection.cursor()
            
            cursor.execute('UPDATE user SET Username = %s, Password = %s, Role = %s, Note = %s WHERE UserID = %s', (username, password, role, note, user_id))
            connection.commit()
            
            cursor.close()
            connection.close()

            return jsonify({'message': 'Người dùng đã được chỉnh sửa thành công'})
        else:
            return jsonify({'message': 'Missing or invalid data in request'})
    else:
        return jsonify({'message': 'Invalid request method'})

@app.route('/user_delete/<string:user_id>', methods=['DELETE'])
def user_delete(user_id):
    if request.method == 'DELETE':
        connection = connect_to_db()
        cursor = connection.cursor()

        cursor.execute('DELETE FROM user WHERE UserID = %s', (user_id,))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Người dùng đã được xóa thành công'})
    else:
        return jsonify({'message': 'Invalid request method'})



# ==============================================================================================
@app.route('/user_list')
def user_list():
    return render_template('user_list.html')

@app.route('/user_info/<string:user_id>')
def user_info(user_id):
    return render_template('user_info.html', user_id=user_id)

@app.route('/user/<string:user_id>', methods=['GET'])
def show_user(user_id):
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM user WHERE UserID=%s', (user_id,))
    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if user:  # Kiểm tra xem có dữ liệu user hay không
        user_info = {
            'UserID': user[0],
            'Username': user[1],
            'Password': user[2],
            'Role': user[3],
            'Note': user[4]
        }
        response = {'status': 200, 'user_info': user_info}
        return jsonify(response)
    else:
        # Trả về thông báo hoặc mã lỗi nếu không tìm thấy người dùng
        return jsonify({'error': 'User not found'}), 404

@app.route('/user_info_list', methods=['GET'])
def user_info_list():
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT UserID FROM user')
    users = cursor.fetchall()
    cursor.close()
    connection.close()

    users_list = [{'UserID': user[0]} for user in users]

    response = {'status': 200, 'users': users_list}
    return jsonify(response)


# ==============================================================================================

@app.route('/nhanvien_index', methods=['GET'])
def nhanvien_index():
    # Tạo kết nối mới
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM nhanvien')  
    nhanviens = cursor.fetchall()

    nhanviens_list = []
    for nhanvien in nhanviens:
        nhanvien_dict = {
            'NhanVienID': nhanvien[0],
            'HoTen': nhanvien[1],
            'NgaySinh': nhanvien[2].strftime('%Y-%m-%d'),
            'Phone': nhanvien[3],
            'DiaChi': nhanvien[4],
            'Gmail': nhanvien[6],
            'GhiChu': nhanvien[7],
            'UserID': nhanvien[8]
        }
        nhanviens_list.append(nhanvien_dict)

    response = {'status': 200, 'nhanviens': nhanviens_list}
    return jsonify(response)

@app.route('/nhanvien_info/<string:nhanvien_id>', methods=['GET'])
def nhanvien_info(nhanvien_id):
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT HoTen FROM nhanvien WHERE NhanVienID=%s', (nhanvien_id,))
    hotenNV = cursor.fetchone()

    cursor.close()
    connection.close()

    nhanvien_info = {
        'HoTen': hotenNV[0]
    }
    
    response = {'status': 200, 'nhanvien_info': nhanvien_info}
    return jsonify(response)

# {
#   "status": 200,
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VyX2lkIjoidXMwMDAwMDEifQ.JRVSgCW1Oq3iRCwmDp4Ec7oBaDXyBZDtjZDx8Yk3P4M",
#   "user_id": "us000001"
# }

@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    token = request.headers.get('Authorization')  # Lấy token từ header Authorization

    if not token:
        return jsonify({'error': 'Token is missing'}), 401
    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        role = decoded_token.get('role')
        user_id = decoded_token.get('user_id')  

        connection = connect_to_db()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM nhanvien WHERE UserID=%s', (user_id,))
        nhanvien = cursor.fetchone()
        user_info = {
            'HoTen': nhanvien[1],
            'NgaySinh': nhanvien[2],
            'Phone': nhanvien[3],
            'DiaChi': nhanvien[4],
            'Gmail': nhanvien[6],
            'GhiChu': nhanvien[7],
        }
        cursor.close()
        connection.close()
        
    
        response = {'status': 200, 'user_info': user_info}
        return jsonify(response)
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401


@app.route('/nhanvien_add', methods=['POST'])
def nhanvien_add():
    data = request.json
    if 'hoten' in data and 'ngaysinh' in data and 'phone' in data and 'diachi' in data and 'gmail' in data and 'ghichu' in data:
        id = generate_random_nhanvien_id()
        hoten = data['hoten']
        ngaysinh = data['ngaysinh']
        phone = data['phone']
        diachi = data['diachi']
        gmail = data['gmail']
        username = data['username']
        password = data['password']
        ghichu = data['ghichu']

        connection = connect_to_db()
        cursor = connection.cursor()

        userid = generate_random_user_id()
        cursor.execute('INSERT INTO user (UserID, Username, Password, Role, Note) VALUES (%s, %s, %s, %s, %s)', (userid, username, password, 'admin', ghichu))
        connection.commit()

        cursor.execute('INSERT INTO nhanvien (NhanVienID, HoTen, NgaySinh, Phone, DiaChi, Gmail, GhiChu, UserID) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)', (id, hoten, ngaysinh, phone, diachi, gmail, ghichu, userid))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'status': 200, 'message': 'Nhân viên đã được thêm mới thành công'})
    else:
        return jsonify({'message': 'Missing or invalid data in request'})


@app.route('/nhanvien_update/<string:nhanvien_id>', methods=['POST'])
def nhanvien_update(nhanvien_id):
    data = request.json
    if 'hoten' in data and 'ngaysinh' in data and 'phone' in data and 'diachi' in data and 'gmail' in data and 'ghichu' in data:
        hoten = data['hoten']
        ngaysinh = data['ngaysinh']
        # ngaysinh = datetime.strptime(data['ngaysinh'], '%Y-%m-%d')
        phone = data['phone']
        diachi = data['diachi']
        gmail = data['gmail']
        ghichu = data['ghichu']

        connection = connect_to_db()
        cursor = connection.cursor()

        cursor.execute('UPDATE nhanvien SET HoTen = %s, NgaySinh = %s, Phone = %s, DiaChi = %s, Gmail = %s, GhiChu = %s WHERE NhanVienID = %s',
                       (hoten, ngaysinh, phone, diachi, gmail, ghichu, nhanvien_id))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'status': 200, 'message': 'Người dùng đã được chỉnh sửa thành công'})
    else:
        return jsonify({'message': 'Missing or invalid data in request'})


@app.route('/nhanvien_delete/<string:nhanvien_id>', methods=['DELETE'])
def nhanvien_delete(nhanvien_id):

    connection = connect_to_db()
    cursor = connection.cursor()
    
    cursor.execute('SELECT UserID FROM nhanvien WHERE NhanVienID=%s', (nhanvien_id,))
    userID = cursor.fetchone()[0]

    cursor.execute('DELETE FROM nhanvien WHERE NhanVienID = %s', (nhanvien_id,))
    connection.commit()

    cursor.execute('DELETE FROM user WHERE userID = %s', (userID,))
    connection.commit()

    cursor.close()
    connection.close()
    
    return jsonify({'message': 'Người dùng đã được xóa thành công'})



# ==============================================================================================
@app.route('/khachhang_index', methods=['GET'])
def khachhang_index():
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM khachhang')
    khachhangs = cursor.fetchall()

    cursor.close()
    connection.close()

    khachhangs_list = []
    for khachhang in khachhangs:
        khachhang_dict = {
            'KhachHangID': khachhang[0],
            'HoTen': khachhang[1],
            'Phone': khachhang[2],
            'DiaChi': khachhang[3],
            'NgaySinh': khachhang[4],
            'GhiChu': khachhang[5],
            'UserID': khachhang[6]
        }
        khachhangs_list.append(khachhang_dict)

    
    response = {'status': 200, 'khachhangs': khachhangs_list}
    return jsonify(response)

@app.route('/khachhang_info/<string:khachhang_id>', methods=['GET'])
def khachhang_info(khachhang_id):
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM khachhang WHERE KhachHangID=%s', (khachhang_id,))
    khachhang = cursor.fetchone()

    cursor.close()
    connection.close()

    khachhang_info = {
        'HoTen': khachhang[1],
        'Phone': khachhang[2],
        'DiaChi': khachhang[3],
        'NgaySinh': khachhang[4],
        'GhiChu': khachhang[5]
    }
    
    response = {'status': 200, 'khachhang_info': khachhang_info}
    return jsonify(response)

@app.route('/khachhang_add', methods=['POST'])
def khachhang_add():
    data = request.json
    if 'hoten' in data and 'ngaysinh' in data and 'phone' in data and 'diachi' in data and 'ghichu' in data and 'userid' in data:
        # id = generate_random_khachhang_id()
        id = data['id']
        hoten = data['hoten']
        ngaysinh = data['ngaysinh']
        phone = data['phone']
        diachi = data['diachi']
        ghichu = data['ghichu']
        userid = data['userid']

        connection = connect_to_db()
        cursor = connection.cursor()
        
        cursor.execute('INSERT INTO khachhang (KhachHangID, HoTen, NgaySinh, Phone, DiaChi, GhiChu, UserID) VALUES (%s, %s, %s, %s, %s, %s, %s)', (id, hoten, ngaysinh, phone, diachi, ghichu, userid))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Người dùng đã được thêm mới thành công'})
    else:
        return jsonify({'message': 'Missing or invalid data in request'})


@app.route('/khachhang_update/<string:khachhang_id>', methods=['POST'])
def khachhang_update(khachhang_id):
    data = request.json
    if 'hoten' in data and 'ngaysinh' in data and 'phone' in data and 'diachi' in data and 'ghichu' in data:
        hoten = data['hoten']
        ngaysinh = data['ngaysinh']
        phone = data['phone']
        diachi = data['diachi']
        ghichu = data['ghichu']

        
        connection = connect_to_db()
        cursor = connection.cursor()

        cursor.execute('UPDATE khachhang SET HoTen = %s, NgaySinh = %s, Phone = %s, DiaChi = %s, GhiChu = %s WHERE KhachHangID = %s',
                       (hoten, ngaysinh, phone, diachi, ghichu, khachhang_id))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Người dùng đã được chỉnh sửa thành công'})
    else:
        return jsonify({'message': 'Missing or invalid data in request'})


@app.route('/khachhang_delete/<string:khachhang_id>', methods=['DELETE'])
def khachhang_delete(khachhang_id):
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('DELETE FROM khachhang WHERE KhachHangID = %s', (khachhang_id,))
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({'message': 'Người dùng đã được xóa thành công'})


# =============================================================================================
@app.route('/danhmuc_index', methods=['GET'])
def danhmuc_index():
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM danhmuc')  
    danhmucs = cursor.fetchall()
    cursor.close()
    connection.close()

    # Convert danh sách thành từ điển để jsonify có thể xử lý
    danhmucs_list = []
    for danhmuc in danhmucs:
        danhmuc_dict = {
            'DanhMucID': danhmuc[0],
            'TenDanhMuc': danhmuc[1],
            'MoTa': danhmuc[2]
        }
        danhmucs_list.append(danhmuc_dict)

    response = {'status': 200, 'danhmucs': danhmucs_list}
    return jsonify(response)

@app.route('/danhmuc_find/<string:danhmuc_id>', methods=['GET'])
def danhmuc_find(danhmuc_id):
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM sanpham WHERE DanhMucID=%s', (danhmuc_id))  
    sanphams = cursor.fetchall()
    cursor.close()
    connection.close()

    # Convert danh sách thành từ điển để jsonify có thể xử lý
    sanphams_list = []
    for sanpham in sanphams:
        sanpham_dict = {
            'SanPhamID': sanpham[0],
            'TenSanPham': sanpham[1],
            'ThongTinSanPham': sanpham[2],
            'GiaBan': sanpham[3]
        }
        sanphams_list.append(sanpham_dict)

    response = {'status': 200, 'sanphams': sanphams_list}
    return jsonify(response)

@app.route('/danhmuc_add', methods=['POST'])
def danhmuc_add():
    data = request.json
    if 'tendanhmuc' in data and 'mota' in data:
        id = generate_random_danhmuc_id()
        tendanhmuc = data['tendanhmuc']
        mota = data['mota']


        connection = connect_to_db()
        cursor = connection.cursor()
        cursor.execute('INSERT INTO danhmuc (DanhMucID, TenDanhMuc, MoTa) VALUES (%s, %s, %s)', (id, tendanhmuc, mota))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Danh muc đã được thêm mới thành công', 'status': 'success'})
    else:
        return jsonify({'message': 'Missing or invalid data in request', 'status': 'error'})


@app.route('/danhmuc_update/<string:danhmuc_id>', methods=['POST'])
def danhmuc_update(danhmuc_id):
    data = request.json
    if 'tendanhmuc' in data and 'mota' in data:
        tendanhmuc = data['tendanhmuc']
        mota = data['mota']

        connection = connect_to_db()
        cursor = connection.cursor()
        cursor.execute('UPDATE danhmuc SET TenDanhMuc = %s, MoTa = %s WHERE DanhMucID = %s', (tendanhmuc, mota, danhmuc_id))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Người dùng đã được chỉnh sửa thành công', 'status': 'success'})
    else:
        return jsonify({'message': 'Missing or invalid data in request', 'status': 'error'})


@app.route('/danhmuc_delete/<string:danhmuc_id>', methods=['DELETE'])
def danhmuc_delete(danhmuc_id):
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('DELETE FROM danhmuc WHERE DanhMucID = %s', (danhmuc_id,))
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({'message': 'Người dùng đã được xóa thành công', 'status': 'success'})



# ==============================================================================================
@app.route('/sanpham_index')
def sanpham_index():
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM sanpham')  
    sanphams = cursor.fetchall()

    sanphams_list = []
    for sanpham in sanphams:
        cursor.execute('SELECT TenDanhMuc FROM danhmuc WHERE DanhMucID = %s', sanpham[5])
        ten = cursor.fetchone()
        sanpham_dict = {
            'SanPhamID': sanpham[0],
            'TenSanPham': sanpham[1],
            'ThongTinSanPham': sanpham[2],
            'GiaBan': sanpham[3],
            'HinhAnh': sanpham[4],
            'DanhMucID': sanpham[5],
            'TenDanhMuc': ten[0] if ten else None
        }
        sanphams_list.append(sanpham_dict)

    cursor.close()
    connection.close()

    response = {'status': 200, 'sanphams': sanphams_list}
    return jsonify(response)

@app.route('/sanpham_select/<string:sanpham_id>', methods=['GET'])
def sanpham_select(sanpham_id):
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM sanpham WHERE SanPhamID=%s', (sanpham_id,))  
    sanpham = cursor.fetchone()

    cursor.execute('SELECT TenDanhMuc FROM danhmuc WHERE DanhMucID = %s', sanpham[5])
    ten = cursor.fetchone()
    sanpham_dict = {
        'SanPhamID': sanpham[0],
        'TenSanPham': sanpham[1],
        'ThongTinSanPham': sanpham[2],
        'GiaBan': sanpham[3],
        'DanhMucID': sanpham[5],
        'TenDanhMuc': ten[0] if ten else None
    }

    cursor.close()
    connection.close()

    response = {'status': 200, 'sanpham_dict': sanpham_dict}
    return jsonify(response)

@app.route('/sanpham_value/<string:sanpham_id>', methods=['GET'])
def sanpham_value(sanpham_id):
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT GiaBan FROM sanpham WHERE SanPhamID=%s', (sanpham_id,))  
    tongtien = cursor.fetchone()

    cursor.close()
    connection.close()

    response = {'status': 200, 'tongtien': tongtien[0]}
    return jsonify(response)

@app.route('/sanpham_add', methods=['POST'])
def sanpham_add():
    if 'tensanpham' in request.form and 'thongtinsanpham' in request.form and 'giaban' in request.form and 'tendanhmuc' in request.form:
        tensanpham = request.form['tensanpham']
        thongtinsanpham = request.form['thongtinsanpham']
        giaban = request.form['giaban']
        tendanhmuc = request.form['tendanhmuc']

        # Xử lý file từ FormData
        if 'image_path' in request.files:
            file = request.files['image_path']
            if file.filename != '':
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                image_path = image_path.replace('\\', '/')  # Thay đổi dấu gạch chéo ngược thành gạch chéo
                file.save(image_path)
            else:
                return 'No selected file'
        else:
            return 'No file part'

        # Thêm sản phẩm vào cơ sở dữ liệu
        connection = connect_to_db()
        cursor = connection.cursor()

        id = generate_random_sanpham_id()

        cursor.execute('SELECT DanhMucID FROM danhmuc WHERE TenDanhMuc = %s', (tendanhmuc,))
        danhmucid = cursor.fetchone()[0]

        cursor.execute('INSERT INTO sanpham (SanPhamID, TenSanPham, ThongTinSanPham, GiaBan, Image, DanhMucID) VALUES (%s, %s, %s, %s, %s, %s)',
                       (id, tensanpham, thongtinsanpham, giaban, image_path, danhmucid))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'status': 200, 'message': 'Sản phẩm đã được thêm mới thành công'})
    else:
        return jsonify({'message': 'Missing or invalid data in request', 'status': 'error'})

@app.route('/sanpham_update/<string:sanpham_id>', methods=['POST'])
def sanpham_update(sanpham_id):
    if 'tensanpham' in request.form and 'thongtinsanpham' in request.form and 'giaban' in request.form and 'tendanhmuc' in request.form:
        connection = connect_to_db()
        cursor = connection.cursor()

        tensanpham = request.form['tensanpham']
        thongtinsanpham = request.form['thongtinsanpham']
        giaban = request.form['giaban']
        tendanhmuc = request.form['tendanhmuc']

        # Xử lý file từ FormData
        if 'image_path' in request.files:
            file = request.files['image_path']
            if file.filename != '':
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                image_path = image_path.replace('\\', '/')  # Thay đổi dấu gạch chéo ngược thành gạch chéo
                file.save(image_path)
            else:
                return 'No selected file'
        else:
            return 'No file part'
        
        cursor.execute('SELECT DanhMucID FROM danhmuc WHERE TenDanhMuc = %s', tendanhmuc)
        danhmucid = cursor.fetchone()[0]

        cursor.execute('UPDATE sanpham SET TenSanPham = %s, ThongTinSanPham = %s, GiaBan = %s, Image = %s, DanhMucID = %s WHERE SanPhamID = %s', (tensanpham, thongtinsanpham, giaban, image_path, danhmucid, sanpham_id))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'message': 'Sản phẩm đã được chỉnh sửa thành công', 'status': 200})
    else:
        return jsonify({'message': 'Missing or invalid data in request', 'status': 'error'})

@app.route('/sanpham_delete/<string:sanpham_id>', methods=['DELETE'])
def sanpham_delete(sanpham_id):
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('DELETE FROM sanpham WHERE SanPhamID = %s', (sanpham_id,))
    connection.commit()

    cursor.close()
    connection.close()
    return jsonify({'message': 'Người dùng đã được xóa thành công', 'status': 200})


# ==============================================================================================


@app.route('/images')
def images():
    # Hiển thị danh sách hình ảnh từ cơ sở dữ liệu
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM images")
    images = cursor.fetchall()

    cursor.close()
    connection.close()

    return render_template('images.html', images=images)

@app.route('/add_image', methods=['GET', 'POST'])
def add_image():

    if request.method == 'POST':
        name = request.form.get('name')

        if 'image_path' not in request.files:
            return 'No file part'
        
        file = request.files['image_path']

        # Kiểm tra xem có file nào được chọn không
        if file.filename == '':
            return 'No selected file'
        
        # Lưu file vào thư mục uploads
        if file:
            # Lưu file vào thư mục static/images
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            image_path = image_path.replace('\\', '/')  # Thay đổi dấu gạch chéo ngược thành gạch chéo
            file.save(image_path)
            
            # Lưu đường dẫn của hình ảnh vào cơ sở dữ liệu
            connection = connect_to_db()
            cursor = connection.cursor()

            cursor.execute("INSERT INTO images (name, image) VALUES (%s, %s)", (name, image_path))
            connection.commit()
            cursor.close()
            connection.close()
            
            return redirect(url_for('images'))
    
    return render_template('add_image.html')


# ==============================================================================================
@app.route('/donhang_index', methods=['GET'])
def donhang_index():
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM donhang')
    donhangs = cursor.fetchall()

    donhangs_list = []
    for donhang in donhangs:
        cursor.execute('SELECT HoTen FROM khachhang WHERE KhachHangID = %s', donhang[1])
        tenkh = cursor.fetchone()
        cursor.execute('SELECT HoTen FROM nhanvien WHERE NhanVienID = %s', donhang[2])
        tennv = cursor.fetchone()
        tenkhachhang = tenkh[0] if tenkh else None
        tenNhanVien = tennv[0] if tennv else None

        donhang_dict = {
            'DonHangID': donhang[0],
            'KhachHangID': donhang[1],
            'NhanVienID': donhang[2],
            'NgayMua': donhang[3].strftime('%Y-%m-%d'),
            'SoLuong': donhang[4],
            'TongTien': donhang[5],
            'TenKhachHang': tenkhachhang,
            'TenNhanVien': tenNhanVien
        }
        donhangs_list.append(donhang_dict)

    cursor.close()
    connection.close()

    response = {'status': 200, 'donhangs': donhangs_list}
    return jsonify(response)

# @app.route('/donhang_add', methods=['POST'])
# def donhang_add():
#     data = request.json
#     if 'tenkhachhang' in data and 'tennhanvien' in data and 'ngaymua' in data and 'soluong' in data and 'tongtien' in data:     
#         connection = connect_to_db()
#         cursor = connection.cursor()

#         id = data['id']
#         tenkhachhang = data['tenkhachhang']
#         tennhanvien = data['tennhanvien']
#         ngaymua = data['ngaymua']
#         soluong = data['soluong']
#         tongtien = data['tongtien']

#         cursor.execute('SELECT KhachHangID FROM khachhang WHERE HoTen = %s', tenkhachhang)
#         khachhangid = cursor.fetchone()[0]
#         cursor.execute('SELECT NhanVienID FROM nhanvien WHERE HoTen = %s', tennhanvien)
#         nhanvienid = cursor.fetchone()[0]

#         cursor.execute('INSERT INTO donhang (DonHangID, KhachHangID, NhanVienID, NgayMua, SoLuong, TongTien) VALUES (%s, %s, %s, %s, %s, %s)', (id, khachhangid, nhanvienid, ngaymua, soluong, tongtien))
#         connection.commit()

#         cursor.close()
#         connection.close()
    
#         return jsonify({'message': 'Người dùng đã được thêm mới thành công', 'status': 'success'})
#     else:
#         return jsonify({'message': 'Missing or invalid data in request', 'status': 'error'})
@app.route('/donhang_add', methods=['POST'])
def donhang_add():
    data = request.json

    connection = connect_to_db()
    cursor = connection.cursor()

    id = data['id']
    khachhangid = data['khachhangid']
    nhanvienid = data['selectedNhanVienID']
    soluong = data['soluong']
    tongtien = data['tongtien']

    cursor.execute('INSERT INTO donhang (DonHangID, KhachHangID, NhanVienID, SoLuong, TongTien) VALUES (%s, %s, %s, %s, %s)', (id, khachhangid, nhanvienid, soluong, tongtien))
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({'message': 'Đơn hàng đã được thêm mới thành công', 'status': 'success'})



@app.route('/donhang_update/<string:donhang_id>', methods=['POST'])
def donhang_update(donhang_id):
    data = request.json
    if 'tenkhachhang' in data and 'tennhanvien' in data and 'ngaymua' in data and 'soluong' in data and 'tongtien' in data:
        connection = connect_to_db()
        cursor = connection.cursor()

        tenkhachhang = data['tenkhachhang']
        tennhanvien = data['tennhanvien']
        ngaymua = data['ngaymua']
        soluong = data['soluong']
        tongtien = data['tongtien']

        cursor.execute('SELECT KhachHangID FROM khachhang WHERE HoTen = %s', tenkhachhang)
        khachhangid = cursor.fetchone()[0]
        cursor.execute('SELECT NhanVienID FROM nhanvien WHERE HoTen = %s', tennhanvien)
        nhanvienid = cursor.fetchone()[0]

        cursor.execute('UPDATE donhang SET KhachHangID = %s, NhanVienID = %s, NgayMua = %s, SoLuong = %s, TongTien = %s WHERE DonHangID = %s', (khachhangid, nhanvienid, ngaymua, soluong, tongtien, donhang_id))
        connection.commit()

        cursor.close()
        connection.close()
        return jsonify({'message': 'Người dùng đã được chỉnh sửa thành công', 'status': 'success'})
    else:
        return jsonify({'message': 'Missing or invalid data in request', 'status': 'error'})

@app.route('/donhang_delete/<string:donhang_id>', methods=['DELETE'])
def donhang_delete(donhang_id):
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('DELETE FROM chitietdonhang WHERE DonHangID = %s', (donhang_id,))
    connection.commit()
    
    cursor.execute('DELETE FROM donhang WHERE DonHangID = %s', (donhang_id,))
    connection.commit()

    cursor.close()
    connection.close()
    return jsonify({'message': 'Người dùng đã được xóa thành công', 'status': 'success'})
# ==============================================================================================

@app.route('/ctdh_index', methods=['GET'])
def ctdh_index():
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM chitietdonhang')
    ctdhs = cursor.fetchall()

    ctdhs_list = []
    for ctdh in ctdhs:
        cursor.execute('SELECT TenSanPham, GiaBan FROM sanpham WHERE SanPhamID = %s', ctdh[2])
        sp = cursor.fetchone()
        tensanpham, giaban = sp if sp else (None, None)

        ctdh_dict = {
            'ChiTietDonHangID': ctdh[0],
            'DonHangID': ctdh[1],
            'SanPhamID': ctdh[2],
            'SoLuong': ctdh[3],
            'TenSanPham': tensanpham,
            'GiaBan': giaban
        }
        ctdhs_list.append(ctdh_dict)

    cursor.close()
    connection.close()

    response = {'status': 200, 'ctdhs': ctdhs_list}
    return jsonify(response)

@app.route('/ctdh_info/<string:ctdh_id>', methods=['GET'])
def ctdh_info(ctdh_id):
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM chitietdonhang WHERE ChiTietDonHangID=%s', (ctdh_id))
    ctdh = cursor.fetchone()

    cursor.execute('SELECT TenSanPham, GiaBan, DanhMucID FROM sanpham WHERE SanPhamID = %s', ctdh[2])
    sp = cursor.fetchone()
    tensanpham, giaban, danhmucID = sp if sp else (None, None, None)

    cursor.execute('SELECT TenDanhMuc FROM danhmuc WHERE DanhMucID = %s', (danhmucID))
    tdm = cursor.fetchone()
    tendanhmuc = tdm if tdm else (None)

    ctdh_info = {
        'TenSanPham': tensanpham,
        'GiaBan': giaban,
        'TenDanhMuc': tendanhmuc[0],
        'SoLuong': ctdh[3]
    }

    cursor.close()
    connection.close()

    response = {'status': 200, 'ctdh_info': ctdh_info}
    return jsonify(response)


@app.route('/ctdh_add', methods=['POST'])
def ctdh_add():
    data = request.json
    if 'donhangid' in data and 'tensanpham' in data and 'soluong' in data:
        
        connection = connect_to_db()
        cursor = connection.cursor()
        
        id = generate_random_chitietdonhang_id()
        donhangid = data['donhangid']
        sanphamid = data['sanphamid']
        soluong = data['soluong']
   
        cursor.execute('INSERT INTO chitietdonhang (ChiTietDonHangID, DonHangID, SanPhamID, SoLuong) VALUES (%s, %s, %s, %s)', (id, donhangid, sanphamid, soluong))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'message': 'Người dùng đã được thêm mới thành công', 'status': 'success'})
    else:
        return jsonify({'message': 'Missing or invalid data in request', 'status': 'error'})

@app.route('/ctdh_update/<string:ctdh_id>', methods=['POST'])
def ctdh_update(ctdh_id):
    data = request.json
    if 'donhangid' in data and 'tensanpham' in data and 'soluong' in data:
        
        connection = connect_to_db()
        cursor = connection.cursor()

        donhangid = data['donhangid']
        tensanpham = data['tensanpham']
        soluong = data['soluong']
        
        cursor.execute('SELECT SanPhamID FROM sanpham WHERE TenSanPham = %s', tensanpham)
        sanphamid = cursor.fetchone()[0]

        cursor.execute('UPDATE chitietdonhang SET DonHangID = %s, SanPhamID = %s, SoLuong = %s WHERE ChiTietDonHangID = %s', (donhangid, sanphamid, soluong, ctdh_id))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'message': 'Người dùng đã được chỉnh sửa thành công', 'status': 'success'})
    else:
        return jsonify({'message': 'Missing or invalid data in request', 'status': 'error'})

@app.route('/ctdh_delete/<string:ctdh_id>', methods=['DELETE'])
def ctdh_delete(ctdh_id):
    
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('DELETE FROM chitietdonhang WHERE ChiTietDonHangID = %s', (ctdh_id,))
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({'message': 'Người dùng đã được xóa thành công', 'status': 'success'})


# ==============================================================================================

@app.route('/bill_list')
def bill_list():
    return render_template('bill_list.html')

@app.route('/bill_view/<string:donhang_id>', methods=['GET'])
def bill_view(donhang_id):
    connection = connect_to_db()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM donhang WHERE DonHangID=%s', (donhang_id,))
    donhang = cursor.fetchone()

    donhang_info = {
        'DonHangID': donhang[0],
        'KhachHangID': donhang[1],
        'NhanVienID': donhang[2],
        'NgayMua': donhang[3],
        'SoLuong': donhang[4],
        'TongTien': donhang[5]
    }

    cursor.execute('SELECT SanPhamID FROM chitietdonhang WHERE DonHangID = %s', (donhang[0],))
    sanphamsID = cursor.fetchall()
    products = []

    for sanphamID in sanphamsID:
        cursor.execute('SELECT TenSanPham, GiaBan, DanhMucID FROM sanpham WHERE SanPhamID = %s', (sanphamID,))
        sp = cursor.fetchone()
        tensanpham, giaban, danhmucid = sp if sp else (None, None, None)

        cursor.execute('SELECT TenDanhMuc FROM danhmuc WHERE DanhMucID = %s', (danhmucid,))
        tendanhmuc = cursor.fetchone()[0]
        products.append({
            'TenSanPham': tensanpham,
            'GiaBan': giaban,
            'TenDanhMuc': tendanhmuc
        })

    donhang_info['SanPham'] = products

    cursor.close()
    connection.close()

    response = {'status': 200, 'donhang_info': donhang_info}
    return jsonify(response)

# ==============================================================================================
@app.route('/bill_form')
def bill_form():
    return render_template('bill_form.html')


@app.route('/bill_add', methods=['POST'])
def bill_add():
    data = request.json
    tongtien = 0

    connection = connect_to_db()
    cursor = connection.cursor()
    
    khachhang_id = generate_random_khachhang_id()
    hoten = data['hoten']
    ngaysinh = data['ngaysinh']
    phone = data['phone']
    diachi = data['diachi']
    ghichu = data['ghichu']
    ngaymua = data['ngaymua']
    nhanVienID = data['nhanVienID']
    soLuong = data['soLuong']
    sanPhamIDs = data['sanPhamIDs']
    for sp_id in sanPhamIDs:
        cursor.execute('SELECT GiaBan FROM sanpham WHERE SanPhamID=%s', (sp_id,))
        tongtien += cursor.fetchone()[0]

    
    cursor.execute('INSERT INTO khachhang (KhachHangID, HoTen, NgaySinh, Phone, DiaChi, GhiChu) VALUES (%s, %s, %s, %s, %s, %s)', (khachhang_id, hoten, ngaysinh, phone, diachi, ghichu))
    connection.commit()
    
    donhang_id = generate_random_donhang_id()
    cursor.execute('INSERT INTO donhang (DonHangID, KhachHangID, NhanVienID, NgayMua, SoLuong, TongTien) VALUES (%s, %s, %s, %s, %s, %s)', (donhang_id, khachhang_id, nhanVienID, ngaymua, soLuong, tongtien))
    connection.commit()

    for sp_id in sanPhamIDs:
        ctdh_id = generate_random_chitietdonhang_id()
        cursor.execute('INSERT INTO chitietdonhang (ChiTietDonHangID, DonHangID, SanPhamID, SoLuong) VALUES (%s, %s, %s, %s)', (ctdh_id, donhang_id, sp_id, 1))
        connection.commit() 

    cursor.close()
    connection.close()

    return jsonify({'message': 'Người dùng đã được thêm mới thành công', 'status': 200})






if __name__ == '__main__':
    app.run(debug=True)