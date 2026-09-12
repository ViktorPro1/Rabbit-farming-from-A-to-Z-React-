import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import { useOrganization } from "../../hooks/useOrganization";
import "./JoinOrganization.css";

export default function JoinOrganization() {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refresh } = useOrganization();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setErrorMessage("Введіть код запрошення");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.rpc("redeem_invite_code", {
        code: trimmedCode,
      });

      if (error) throw error;

      refresh();
      navigate("/registry");
    } catch (error) {
      logError("JoinOrganization", error);
      setErrorMessage(
        "Код недійсний, вже використаний, або сталася помилка. Перевірте код і спробуйте ще раз."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="join-organization">
      <div className="join-organization__card">
        <h1 className="join-organization__title">Приєднатися до ферми</h1>
        <p className="join-organization__subtitle">
          Введіть код запрошення, який надав вам власник ферми, щоб отримати
          доступ до кабінету.
        </p>

        <form className="join-organization__form" onSubmit={handleSubmit}>
          <label className="join-organization__label" htmlFor="invite-code">
            Код запрошення
          </label>
          <input
            id="invite-code"
            className="join-organization__input"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Напр. ABCD1234"
            autoComplete="off"
            disabled={isSubmitting}
          />

          {errorMessage && (
            <p className="join-organization__error">{errorMessage}</p>
          )}

          <button
            className="join-organization__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Перевірка..." : "Приєднатися"}
          </button>
        </form>
      </div>
    </div>
  );
}
