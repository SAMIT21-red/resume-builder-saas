import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          navigate("/dashboard");
          return;
        }

        await api.post(`/api/payment/confirm?sessionId=${sessionId}`);

        // redirect after updating DB
        navigate("/dashboard");

      } catch (err) {
        console.error("Payment confirmation failed", err);
        navigate("/dashboard");
      }
    };

    confirmPayment();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-bold">
      Processing Payment...
    </div>
  );
};

export default PaymentSuccess;