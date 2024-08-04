import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const { supabase } = useContext(AuthContext);

  async function signInWithDiscord() {
    return await supabase.auth.signInWithOAuth({
      provider: "discord",
    });
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await signInWithDiscord();

    if (error) {
      return console.log(error?.error_description || error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <button
        type="submit"
        className="rounded bg-sky-400 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        disabled={loading}
      >
        {loading ? <span>Loading</span> : <span>Discord login</span>}
      </button>
    </form>
  );
}
