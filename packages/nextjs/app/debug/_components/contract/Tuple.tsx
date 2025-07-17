import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ContractInput } from "./ContractInput";
import { getFunctionInputKey, getInitialTupleFormState } from "./utilsContract";
import { replacer } from "~~/utils/scaffold-eth/common";
import { AbiParameterTuple } from "~~/utils/scaffold-eth/contract";

type TupleProps = {
  abiTupleParameter: AbiParameterTuple;
  setParentForm: Dispatch<SetStateAction<Record<string, any>>>;
  parentStateObjectKey: string;
  parentForm: Record<string, any> | undefined;
};

export const Tuple = ({ abiTupleParameter, setParentForm, parentStateObjectKey }: TupleProps) => {
  const [form, setForm] = useState<Record<string, any>>(() => getInitialTupleFormState(abiTupleParameter));

  useEffect(() => {
    const values = Object.values(form);
    const argsStruct: Record<string, any> = {};
    abiTupleParameter.components.forEach((component, componentIndex) => {
      argsStruct[component.name || `input_${componentIndex}_`] = values[componentIndex];
    });

    setParentForm(parentForm => ({ ...parentForm, [parentStateObjectKey]: JSON.stringify(argsStruct, replacer) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(form, replacer)]);

  return (
    <div>
      <div
        tabIndex={0}
        className="collapse collapse-arrow glass-card bg-gradient-to-r from-purple-500/10 to-pink-500/10 pl-4 py-1.5 border-2 border-purple-500/30"
      >
        <input type="checkbox" className="min-h-fit! peer" />
        <div className="collapse-title after:top-3.5! p-0 min-h-fit! peer-checked:mb-2 text-purple-400/80">
          <p className="m-0 p-0 text-[1rem] font-rajdhani font-medium">{abiTupleParameter.internalType}</p>
        </div>
        <div className="ml-3 flex-col space-y-4 border-purple-500/50 border-l-2 pl-4 collapse-content">
          {abiTupleParameter?.components?.map((param, index) => {
            const key = getFunctionInputKey(abiTupleParameter.name || "tuple", param, index);
            return <ContractInput setForm={setForm} form={form} key={key} stateObjectKey={key} paramType={param} />;
          })}
        </div>
      </div>
    </div>
  );
};
