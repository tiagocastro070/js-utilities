/*
 * Please refer to the terms of the license agreement.
 *
 * (c) 2024 Feedzai, Rights Reserved.
 */
import { useAutoId } from "src/hooks";

function DemoComponent({ value = null, prefix }: { value?: string | null; prefix?: string }) {
  const firstId = useAutoId(value, prefix);
  const secondId = useAutoId();
  return (
    <div>
      <p id={firstId}>A paragraph</p>
      <span id={secondId}>An inline span element</span>
    </div>
  );
}

function FallbackDemo({
  value = "feedzai-fallback-id",
  prefix,
}: {
  value?: string | null;
  prefix?: string;
}) {
  const id = useAutoId(value, prefix);
  return <h1 id={id}>Feedzai</h1>;
}

describe("useAutoId", () => {
  it("should generate a unique ID value", () => {
    cy.mount(<DemoComponent />);

    cy.findByText("A paragraph")
      .invoke("attr", "id")
      .then((idOne) => {
        cy.findByText("An inline span element").invoke("attr", "id").should("not.equal", idOne);
      });
  });

  it("should generate a prefixed unique ID value", () => {
    const expected = "feedzai-a-prefix";
    cy.mount(<DemoComponent value={undefined} prefix={expected} />);

    cy.findByText("A paragraph").invoke("attr", "id").should("contain", expected);
  });

  it("uses a fallback ID", () => {
    cy.mount(<FallbackDemo />);

    cy.findByText("Feedzai").should("have.id", "feedzai-fallback-id");
  });

  it("should return a prefixed fallback ID", () => {
    cy.mount(<FallbackDemo prefix="js-prefix" value="423696e5" />);

    cy.findByText("Feedzai").should("have.id", "js-prefix--423696e5");
  });
});
