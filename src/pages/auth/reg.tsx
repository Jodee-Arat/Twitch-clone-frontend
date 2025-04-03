import { useForm, SubmitHandler } from "react-hook-form";
import { IUser } from "../../models/types/user.types";

const Reg = () => {
  const { register, handleSubmit } = useForm<IUser>();
  const onSubmit: SubmitHandler<IUser> = async (data) => {
    console.log(data);

    const success = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(console.log);
    console.log(success);
  };

  return (
    <form className="bg-black text-white" onSubmit={handleSubmit(onSubmit)}>
      <label>Username</label>
      <input className="bg-white text-black" {...register("username")} />
      <label>password</label>
      <input className="bg-white text-black" {...register("password")} />
      <button className="bg-red-600" type="submit">
        тыкай
      </button>
    </form>
  );
};

export default Reg;
