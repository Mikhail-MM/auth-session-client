import React from "react";
import { useForm } from "react-hook-form";

function LoginForm() {
  const { register, errors, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);
  

  return (
    <div className="w-full max-w-md bg-gray-800">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" bg-white shadow-md rounded px-8 py-8 pt-8"
      >
        <div className="px-4 pb-4">
          <label htmlFor="email" className="text-sm block font-bold  pb-2">
            EMAIL ADDRESS
          </label>
          <input
            ref={register({
              required: { value: true, message: "Email Is Required!" },
            })}
            type="email"
            name="email"
            id=""
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
            placeholder="Johnbull@example.com"
          />
          {errors?.email?.message}
        </div>
        <div className="px-4 pb-4">
          <label htmlFor="password" className="text-sm block font-bold pb-2">
            PASSWORD
          </label>
          <input
            ref={register({
              required: { value: true, message: "Password Is Required!" },
            })}
            type="password"
            name="password"
            id=""
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
            placeholder="Enter your password"
          />
          {errors?.password?.message}
        </div>
        <div>
          <input type="submit" className="btn" value="Sign In" />
        </div>
      </form>
    </div>
  );
}

function RegisterForm() {
  const { register, errors, handleSubmit, getValues } = useForm({
    //reValidateMode: "onSubmit",
    criteriaMode: "all",
  });

  const onSubmit = (data) => console.log(data);


  return (
    <div className="w-full max-w-md bg-gray-800">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" bg-white shadow-md rounded px-8 py-8 pt-8"
      >
        <div className="px-4 pb-4">
          <label htmlFor="email" className="text-sm block font-bold pb-2">
            EMAIL ADDRESS
          </label>
          <input
            ref={register({
              required: { value: true, message: "Email Is Required!" },
            })}
            type="email"
            name="email"
            id=""
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
            placeholder="Johnbull@example.com"
          />
          {errors?.email?.message}
        </div>
        <div className="px-4 pb-4">
          <label htmlFor="password" className="text-sm block font-bold pb-2">
            PASSWORD
          </label>
          <input
            ref={register({
              required: { value: true, message: "Password Is Required!" },
            })}
            type="password"
            name="password"
            id=""
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
            placeholder="Enter your password"
          />
          {errors?.password?.types?.required}
        </div>
        <div className="px-4 pb-4">
          <label htmlFor="password" className="text-sm block font-bold pb-2">
            CONFIRM PASSWORD
          </label>
          <input
            ref={register({
              required: {
                value: true,
                message: "Confirmed Password Is Required!",
              },
              validate: {
                matchPW: (value) =>
                  value === getValues().password || "Password must match!",
              },
            })}
            type="password"
            name="confirmPassword"
            id=""
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
            placeholder="Confirm your password"
          />

          {errors?.password?.types?.required}
          {errors?.password?.types?.matchPW}
        </div>
        <div>
          <input type="submit" className="btn" value="Register" />
        </div>
      </form>
    </div>
  );
}
function App() {
  return (
    <div className="App h-full flex justify-center items-center">
      <LoginForm />
      <RegisterForm />
    </div>
  );
}

export default App;
