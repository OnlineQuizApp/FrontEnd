export default function UnauthorizedComponent() {
    return (
        <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
            <h2>🚫 Không có quyền truy cập</h2>
            <p>Bạn cần tài khoản ADMIN để truy cập trang này.</p>
        </div>
    );
}