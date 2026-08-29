import { useForm } from "react-hook-form";
import { LoginPassType } from "../../types/loginPass";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginPasswordSchema } from "../../schema/login.password.schema";
import loginPasswordInputs from "../../inputsStructure/loginPassword.structure";

function LoginPass({
  isPending,
  handleLoginPassword,
}: {
  isPending: boolean;
  handleLoginPassword: (data: LoginPassType) => void;
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginPassType>({
    resolver: zodResolver(loginPasswordSchema),
    mode: "onTouched",
  });
  return (
    <div className="">
      <h2 className="text-cream-surface text-center mt-10 tracking-[0.2rem] font-bold">
        شماره تلفن و رمزعبور خود را وارد کنید
      </h2>
      <div className="mx-auto my-3 h-px w-5/12 bg-linear-to-r from-transparent via-cream-accent-bright to-transparent" />
      <form onSubmit={handleSubmit(handleLoginPassword)} className="space-y-3">
        {loginPasswordInputs.map((input) => (
          <div
            key={input.name}
            className="group relative flex flex-col gap-1.5"
          >
            <label
              htmlFor={input.name}
              className="text-sm font-medium text-cream-border"
            ></label>
            <input
              id={input.name}
              maxLength={11}
              inputMode="numeric"
              placeholder={input.placeholder}
              type={input.type}
              {...register(input.name)}
              className={`w-full border-b-4 bg-transparent px-1 py-1.5 text-sm text-cream-card outline-none transition-all duration-500 placeholder:text-cream-muted/70 focus:border-cream-accent-bright group-hover:border-cream-muted ${
                errors[input.name]
                  ? "border-cream-danger"
                  : "border-cream-border"
              }`}
            />
            {errors[input.name]?.message && (
              <span className="text-xs text-cream-danger">
                {errors[input.name]?.message}
              </span>
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={isPending}
          className="bg-cream-accent-bright w-full mt-5 h-10 flex items-center justify-center rounded-md text-cream-surface
          hover:cursor-pointer hover:bg-cream-accent-dark transition-all duration-300
          disabled:bg-cream-accent-dark disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              در حال پردازش...
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </span>
          ) : (
            "ورود"
          )}
        </button>
      </form>
    </div>
  );
}

export default LoginPass;
