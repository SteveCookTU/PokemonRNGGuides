import React from "react";
import { Flex } from "./flex";
import { Button } from "./button";
import { TableProps } from "antd";
import { Input } from "./input";
import { gen2_generate_rng_states } from "rng_tools";
import { Form } from "./form";
import { Formik, useFormikContext } from "formik";
import {
  DecimalString,
  fromDecimalString,
  fromHexString,
  HexString,
  toDecimalString,
  toHexString,
} from "~/utils/number";
import { ResultTable } from "./resultTable";
import { FormFieldTable } from "./formFieldTable";

type RngState = {
  advance: number;
  rand: number;
  div: number;
};

const columns: TableProps<unknown>["columns"] = [
  {
    title: "Advance",
    dataIndex: "advance",
    key: "advance",
  },
  {
    title: "State",
    dataIndex: "rand",
    key: "rand",
    render: (rand) => rand.toString(16).padStart(4, "0"),
  },
  {
    title: "Div",
    dataIndex: "div",
    key: "div",
    render: (div) => div.toString(16).padStart(4, "0"),
  },
];

type Field = {
  label: string;
  input: React.ReactNode;
};

type FormState = {
  div: HexString;
  adivIndex: DecimalString;
  sdivIndex: DecimalString;
  state: HexString;
  startAdvance: DecimalString;
  advanceCount: DecimalString;
};

const OptionsForm = () => {
  const formik = useFormikContext<FormState>();
  const fields: Field[] = [
    {
      label: "ADiv Index",
      input: (
        <Input
          name="adivIndex"
          placeholder="100"
          onChange={formik.handleChange}
        />
      ),
    },
    {
      label: "SDiv Index",
      input: (
        <Input
          name="sdivIndex"
          placeholder="100"
          onChange={formik.handleChange}
        />
      ),
    },
    {
      label: "Div",
      input: (
        <Input name="div" placeholder="ab" onChange={formik.handleChange} />
      ),
    },

    {
      label: "State",
      input: (
        <Input name="state" placeholder="cdef" onChange={formik.handleChange} />
      ),
    },
    {
      label: "Start Advance",
      input: (
        <Input
          name="startAdvance"
          placeholder="100"
          onChange={formik.handleChange}
        />
      ),
    },
    {
      label: "Advance Count",
      input: (
        <Input
          name="advanceCount"
          value={formik.values.advanceCount}
          disabled
          onChange={formik.handleChange}
        />
      ),
    },
  ];

  return (
    <Form>
      <Flex vertical gap={8}>
        <FormFieldTable fields={fields} />
        <Button trackerId="generate_gen2_starters" htmlType="submit">
          Generate
        </Button>
      </Flex>
    </Form>
  );
};

const initialState: FormState = {
  div: toHexString(0),
  adivIndex: toDecimalString(0),
  sdivIndex: toDecimalString(0),
  state: toHexString(0),
  startAdvance: toDecimalString(0),
  advanceCount: toDecimalString(10000),
};

export const Gen2Rng = () => {
  const [results, setResults] = React.useState<RngState[]>([]);

  return (
    <Flex vertical gap={16}>
      <Formik
        initialValues={initialState}
        onSubmit={(opts) => {
          const div = fromHexString(opts.div) ?? 0;
          const startAdvance = fromDecimalString(opts.startAdvance) ?? 0;
          const advanceCount = fromDecimalString(opts.advanceCount) ?? 0;
          const results = gen2_generate_rng_states(
            div >>> 8,
            div & 0xff,
            fromDecimalString(opts.adivIndex) ?? 0,
            fromDecimalString(opts.sdivIndex) ?? 0,
            fromHexString(opts.state) ?? 0,
            startAdvance,
            startAdvance + advanceCount,
          );
          setResults(
            results.map(({ add_div, sub_div, advance, rand }) => ({
              advance,
              rand,
              div: (add_div << 8) | sub_div,
            })),
          );
        }}
      >
        <OptionsForm />
      </Formik>
      <ResultTable columns={columns} dataSource={results} />
    </Flex>
  );
};
