import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // Bootstrap icons
import dotenv from "dotenv";
import process from "process";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // To toggle confirm password visibility
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger"); // For alert styling
  const navigate = useNavigate(); // useNavigate hook for redirection

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      setVariant("danger");
      return;
    }

    dotenv.config();

    const API_BASE_URL = process.env.API_BASE_URL;

    try {
      await axios.post(
        `${API_BASE_URL}/reset-password`,
        {
          newPassword,
        },
        {
          params: { token },
        }
      );
      setMessage("Sikeres jelszó változtatás!");
      setVariant("success");

      setTimeout(() => {
        navigate("/belepes");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data || "Valami hiba történt!");
      setVariant("danger");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "100%", maxWidth: "400px" }} className="p-4 shadow">
        <h2 className="text-center mb-4">Állítsa vissza jelszavát</h2>
        <Form onSubmit={handlePasswordReset}>
          <Form.Group controlId="formNewPassword" className="mb-3">
            <Form.Label>Új jelszó</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Írjon be egy új jelszót"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <InputGroup.Text
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formConfirmPassword" className="mb-3">
            <Form.Label>Jelszó megerősítése</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Erősítse meg az új jelszót"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <InputGroup.Text
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ cursor: "pointer" }}
              >
                {showConfirmPassword ? <EyeSlash /> : <Eye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Jelszó visszaállítása
          </Button>
        </Form>

        {message && (
          <Alert variant={variant} className="mt-3">
            {message}
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default ResetPasswordPage;
