type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function PrimaryButton({
  children,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        px-8
        py-4
        rounded-2xl
        bg-[#A78BFA]
        text-white
        font-medium
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:opacity-90
      "
    >
      {children}
    </button>
  );
}