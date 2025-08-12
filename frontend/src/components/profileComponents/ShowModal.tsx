import { Button } from "../ui/button";

type ModalProps = {
  role?: "user" | "guest";
  password: string;
  setPassword: (val: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ShowModal = ({ role, password, setPassword, onCancel, onConfirm }: ModalProps) => {
  const isGuest = role === "guest";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
        {isGuest ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center text-black">Guests cannot delete account</h2>
            <p className="text-gray-700 text-sm mb-6 text-center">Guest accounts are temporary and will expire automatically after 10 minutes. Please register for a permanent account.</p>
            <div className="flex justify-center">
              <Button variant="outline" onClick={onCancel} className="cursor-pointer">
                OK
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center text-black">Please enter your password</h2>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border border-gray-300 rounded text-black mb-4" />
            <p className="text-red-500 text-sm mb-4">Confirm that you want to delete your account. This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={onCancel} className="cursor-pointer">
                Cancel
              </Button>
              <Button onClick={onConfirm} className="cursor-pointer">
                Confirm
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
