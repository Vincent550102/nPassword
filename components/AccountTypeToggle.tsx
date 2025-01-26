import { useState, useEffect, useCallback } from "react";

interface AccountTypeToggleProps {
  onChange: (accountType: "local" | "domain") => void;
  initialType?: "local" | "domain";
}

const AccountTypeToggle: React.FC<AccountTypeToggleProps> = ({
  onChange,
  initialType = "domain",
}) => {
  const [selected, setSelected] = useState<"local" | "domain">(initialType);

  const handleToggle = useCallback(
    (accountType: "local" | "domain") => {
      setSelected(accountType);
      onChange(accountType);
    },
    [onChange],
  );

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  return (
    <div className="flex justify-center my-4">
      <button
        className={`px-4 py-2 rounded-r ${
          selected === "domain" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleToggle("domain")}
      >
        Domain Account
      </button>
      <button
        className={`px-4 py-2 rounded-l ${
          selected === "local" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleToggle("local")}
      >
        Local Account
      </button>
    </div>
  );
};

export default AccountTypeToggle;
