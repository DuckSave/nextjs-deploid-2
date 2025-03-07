import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// const MySwal = withReactContent(Swal);

export const SusseccAlert = (title, text) => {
    Swal.fire({
        icon: "success",
        title: title,
        text: text,
    });
}

export const ErrorAlert = (title, text) => {
    Swal.fire({
        icon: "error",
        title: title,
        text: text,
    });
}

export const WarningAlert = (title, text) => {
    Swal.fire({
        icon: "error",
        title: title,
        text: text,
        footer: '<a href="#">cái này khó chữa rồi liên hệ Đức Lưu nha</a>'
      });
}