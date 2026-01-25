import clsx from "clsx";

export const Avatar = ({ name, size = "md" }) => {
  const displayChar =
    typeof name === "string" && name.trim().length > 0
      ? name.trim().charAt(0).toUpperCase()
      : "佚";

  const sizeClassMap = {
    xs: "w-5,h-5 text-[10px]",
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  return (
    <div
      className={clsx(
        "shrink-0 self-start",
        "flex items-center  justify-center rounded-full",
        "bg-blue-500 text-white font-semibold select-none",
        sizeClassMap[size],
      )}
    >
      {displayChar}
    </div>
  );
};
