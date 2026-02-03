import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();

  return (
    <img
      src="/images/logo.png"
      alt="logo"
      className="w-12 cursor-pointer hover:scale-110 transition-transform duration-300"
      onClick={() => navigate("/")}
    />
  );
}
