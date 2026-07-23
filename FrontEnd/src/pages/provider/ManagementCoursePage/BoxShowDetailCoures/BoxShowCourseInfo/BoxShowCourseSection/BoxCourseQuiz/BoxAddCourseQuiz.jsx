import { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import usePostQuiz from "../../../../../../../hooks/useCourse/quizz/usePostQuizzCourse";

const BoxAddCourseQuiz = ({ refetch, sectionId}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { mutate: addQuiz, isPending } = usePostQuiz();

  const handleAdd = (values) => {

    const payload = {
        section_id: sectionId,
        title: values.title,
        description: values.description
    };

    addQuiz(payload, {

        onSuccess: () => {

            notification.success({
                title: "Thành công",
                description: "Tạo Quiz thành công!"
            });

            form.resetFields();

            setOpen(false);

            refetch?.();

        },

        onError: (error) => {

            const status = error?.response?.status;

            if(status===401){

                notification.error({
                    message:"Phiên đăng nhập hết hạn"
                });

                localStorage.clear();

                navigate("/login");

                return;
            }

            notification.error({

                title:"Thất bại",

                description:error?.response?.data?.message

            });

        }

    });

};

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          bg-[#3525CD] text-white px-4 py-2 rounded transition duration-300 ease-in-out
          hover:scale-95 hover:opacity-65 cursor-pointer
        "
      >
        + Tạo Quizz
      </button>

      <Modal
          open={open}
          footer={null}
          destroyOnHidden
          onCancel={()=>{
              form.resetFields();
              setOpen(false);
          }}
      >
        <h1 className="text-[20px] font-semibold text-[#000000] mb-4">
          Thêm quizz
        </h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}   
          autoComplete="off"
        >

          <Form.Item
            label={<span className="text-[12px]">Tên quizz</span>}
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên quizz!" }]}
          >
            <Input className="custom-input" placeholder="Nhập tên quizz" />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">Mô tả</span>}
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả quizz!" }]}
          >
            <Input.TextArea  rows={4}/>
          </Form.Item>

          <Button
            htmlType="submit"
            loading={isPending}
            className="w-full bg-[#3525CD] text-white"
            style={{backgroundColor:"#3525CD" , color:'#ffffff'}}
          >
            Xác nhận thêm
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default BoxAddCourseQuiz;