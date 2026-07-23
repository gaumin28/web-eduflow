import { useRef, useState, useEffect } from "react";
import { Button, Card, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined, PlusOutlined, IdcardOutlined } from "@ant-design/icons";
import useRegisterProvider from "../../../../hooks/useCourse/useRegisterProvider";

// 🆕 Nhớ destructure nhận props từ component cha truyền xuống ở đây nhé!
const RegisterFormAndInfoProvider = ({ initialValues, onSubmitSuccess }) => {
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);
  const { mutate, isPending } = useRegisterProvider();

  // 🆕 Cập nhật state ảnh đại diện: Lấy ảnh cũ từ DB nếu có, không có mới dùng placeholder
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(
    initialValues?.avatar || "https://i.pravatar.cc/300?img=68" 
  );

  // 🆕 Cập nhật state danh sách chứng chỉ: Định dạng lại mảng URL từ DB thành mảng Object Antd Upload hiểu được
  const [certificateList, setCertificateList] = useState([]);

  useEffect(() => {
    if (initialValues) {
      // Đổ dữ liệu text vào form
      form.setFieldsValue(initialValues);
      
      // Đổ dữ liệu ảnh đại diện
      if (initialValues.avatar) setAvatarSrc(initialValues.avatar);
      
      // Đổ dữ liệu danh sách chứng chỉ (Giả định DB lưu mảng chuỗi URL ở trường 'images')
      if (initialValues.images && Array.isArray(initialValues.images)) {
        const formattedImages = initialValues.images.map((url, index) => ({
          uid: `old-img-${index}`,
          name: `Chung-chi-${index + 1}.png`,
          status: "done",
          url: url, // Đường dẫn ảnh cũ trên Cloudinary/S3
        }));
        setCertificateList(formattedImages);
      }
    }
  }, [initialValues, form]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarSrc(previewUrl);
    setAvatarFile(file); 
  };

  const handleCertificateChange = ({ fileList: newFileList }) => {
    setCertificateList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const handleRegister = async (values) => {
    // 🆕 SỬA LOGIC CHECK FILE: Chỉ báo lỗi khi không upload mới VÀ không có sẵn ảnh cũ trong DB
    if (!avatarFile && !initialValues?.avatar) {
      message.error("Vui lòng tải lên ảnh đại diện!");
      return;
    }
    if (certificateList.length === 0) {
      message.error("Vui lòng tải lên ít nhất 1 ảnh chứng chỉ!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("provider_name", values.provider_name);
      formData.append("email", values.email);
      formData.append("career", values.career);
      formData.append("phone", values.phone);
      formData.append("experience_years", values.experience_years);
      formData.append("description", values.description);
      
      // Nếu có chọn file avatar mới thì mới append vào
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Duyệt qua danh sách chứng chỉ
      certificateList.forEach((fileItem) => {
        if (fileItem.originFileObj) {
          // File mới người dùng vừa chọn thêm
          formData.append("images", fileItem.originFileObj);
        } else if (fileItem.url) {
          // 🆕 File cũ đã có sẵn từ trước, gửi URL về để Backend biết user giữ lại ảnh này không xóa
          formData.append("retained_images", fileItem.url);
        }
      });

      mutate(formData, {
        onSuccess: (data) => {
          message.success(data?.message || "Gửi yêu cầu đăng ký thành công!");
          
          // Reset toàn bộ form & state cục bộ
          form.resetFields();
          setCertificateList([]);
          setAvatarFile(null);
          setAvatarSrc("https://i.pravatar.cc/300?img=68");

          //Gọi callback để thông báo cho Page cha đổi trạng thái giao diện
          if (onSubmitSuccess) {
            onSubmitSuccess();
          }
        },
        onError: (error) => {
          const errorMsg = error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!";
          message.error(errorMsg);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Cấu trúc JSX Avatar của bạn giữ nguyên... */}
      <Card className="rounded-2xl h-fit">
        <div className="flex flex-col items-center py-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <UploadOutlined className="text-white text-3xl" />
            </div>
          </div>
          <h3 className="mt-5 text-2xl font-semibold">Ảnh đại diện</h3>
          <p className="text-center text-gray-500 mt-2 mb-5 text-sm">
            Tải lên ảnh chân dung rõ nét của bạn. <br/> (Bắt buộc)
          </p>
          <Button type="default" icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>
            Chọn ảnh
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
        </div>
      </Card>

      
      <Card className="lg:col-span-2 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <IdcardOutlined className="text-xl text-blue-600" />
          <h3 className="text-xl font-semibold">Thông tin đăng ký</h3>
        </div>

        <Form form={form} layout="vertical" onFinish={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Họ và tên (Tên nhà cung cấp)" name="provider_name" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
              <Input placeholder="VD: Nguyễn Văn A" size="large" />
            </Form.Item>
            <Form.Item label="Số điện thoại liên hệ" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
              <Input placeholder="VD: 0123456789" size="large" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Email liên hệ" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}>
              <Input placeholder="VD: email@example.com" size="large" />
            </Form.Item>
            <Form.Item label="Số năm kinh nghiệm thực tế" name="experience_years" rules={[{ required: true, message: "Vui lòng chọn số năm kinh nghiệm!" }]}>
              <Select size="large" placeholder="Chọn số năm kinh nghiệm">
                <Select.Option value={0}>Chưa có kinh nghiệm (Dưới 1 năm)</Select.Option>
                <Select.Option value={1}>1 năm</Select.Option>
                <Select.Option value={2}>2 năm</Select.Option>
                <Select.Option value={3}>3 năm</Select.Option>
                <Select.Option value={4}>4 năm</Select.Option>
                <Select.Option value={5}>Từ 5 năm trở lên</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Nghề nghiệp / Lĩnh vực chuyên môn" name="career" rules={[{ required: true, message: "Vui lòng nhập nghề nghiệp" }]}>
            <Input placeholder="VD: Lập trình viên Front-end, Gia sư Toán..." size="large" />
          </Form.Item>
          
          <Form.Item label="Giới thiệu bản thân" name="description" rules={[{ required: true, message: "Vui lòng viết một vài dòng giới thiệu!" }, { min: 20, message: "Mô tả cần tối thiểu 20 ký tự." }]}>
            <Input.TextArea rows={4} placeholder="Hãy chia sẻ ngắn gọn về kinh nghiệm của bạn..." showCount maxLength={1000} />
          </Form.Item>

          <div className="mt-6 mb-2 border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Chứng chỉ hành nghề (Bằng cấp, CV, v.v.)</h3>
            <p className="text-gray-500 text-sm mb-4">Vui lòng tải lên hình ảnh các chứng chỉ hoặc tài liệu chứng minh năng lực.</p>
            <Form.Item name="images">
              <Upload
                listType="picture-card"
                fileList={certificateList}
                onChange={handleCertificateChange}
                beforeUpload={() => false}
                multiple
                accept="image/*"
              >
                {certificateList.length >= 8 ? null : uploadButton}
              </Upload>
            </Form.Item>
          </div>

          <div className="flex justify-end mt-8">
            <Button type="primary" htmlType="submit" size="large" loading={isPending}>
              Gửi yêu cầu đăng ký
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterFormAndInfoProvider;