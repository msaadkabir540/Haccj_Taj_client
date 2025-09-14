const CustomModal = ({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-xl rounded-2xl bg-white  shadow-xl border border-neutral-200">
        <div className="px-5 pt-5 pb-3 border-b border-neutral-200 ">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        <div className="px-5 py-4 border-t border-neutral-200  flex justify-end gap-2">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
