import React from "react";
import FormTab from "./form-tab";

import CreateFormSubmit from "./form-table";

const FormList = () => {
  return (
    <div className="flex-1">
      <div className="border px-6 py-3 rounded-xl">
        <div className="">
          <FormTab />
        </div>
        <CreateFormSubmit status={false} />
      </div>
    </div>
  );
};

export default FormList;
