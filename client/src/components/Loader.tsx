import { Spinner } from "./ui/spinner";

function Loader({ height }: { height?: string }) {
  return (
    <div className={`flex justify-center items-center ${height}`}>
      <div className="flex justify-center items-center gap-6">
        <Spinner className="size-6 text-red-500" />
        <Spinner className="size-6 text-green-500" />
        <Spinner className="size-6 text-blue-500" />
        <Spinner className="size-6 text-yellow-500" />
        <Spinner className="size-6 text-purple-500" />
      </div>
    </div>
  );
}

export default Loader;
