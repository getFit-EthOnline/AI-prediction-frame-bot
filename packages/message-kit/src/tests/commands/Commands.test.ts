import { commands } from "./commands";
import { fakeUsers as users } from "./usernames";
import { extractCommandValues } from "../../helpers/commands";

describe("Command extraction tests", () => {
  test("Extract values from /tip command", () => {
    const inputContent = "/tip @bob @alice 15";
    const extractedValues = extractCommandValues(inputContent, commands, users);
    expect(extractedValues).toEqual({
      command: "tip",
      params: {
        amount: 15,
        username: expect.arrayContaining([
          expect.objectContaining({
            username: "bob",
          }),
          expect.objectContaining({
            username: "alice",
          }),
        ]),
      },
    });
  });

  test("Extract values from /swap command", () => {
    const inputContent = "/swap 10 eth to usdc";
    const extractedValues = extractCommandValues(inputContent, commands, users);
    expect(extractedValues).toEqual({
      command: "swap",
      params: {
        amount: 10,
        token_from: "eth",
        token_to: "usdc",
      },
    });
  });

  test("Extract values from /mint command", () => {
    const inputContent = "/mint 0x73a333cb82862d4f66f0154229755b184fb4f5b0 1";
    const extractedValues = extractCommandValues(inputContent, commands, users);
    expect(extractedValues).toEqual({
      command: "mint",
      params: {
        collection: "0x73a333cb82862d4f66f0154229755b184fb4f5b0",
        tokenId: 1,
      },
    });
  });

  test("Extract values from /send command", () => {
    const inputContent = "/send 10 usdc @bob";
    const extractedValues = extractCommandValues(inputContent, commands, users);
    expect(extractedValues).toEqual({
      command: "send",
      params: {
        amount: 10,
        token: "usdc",
        username: expect.arrayContaining([
          expect.objectContaining({
            username: "bob",
          }),
        ]),
      },
    });
  });

  test("Extract values from /game command", () => {
    const inputContent = "/game slot";
    const extractedValues = extractCommandValues(inputContent, commands, users);
    expect(extractedValues).toEqual({
      command: "game",
      params: {
        type: "slot",
      },
    });
  });

  test("Extract values from /bet command", () => {
    const inputContent = "/bet @alice @bob 'NBA Game' 100";
    const extractedValues = extractCommandValues(inputContent, commands, users);
    expect(extractedValues).toEqual({
      command: "bet",
      params: {
        username: expect.arrayContaining([
          expect.objectContaining({
            username: "alice",
          }),
          expect.objectContaining({
            username: "bob",
          }),
        ]),
        name: "NBA Game",
        amount: 100,
      },
    });
  });

  test("Extract values from /admin add command", () => {
    const inputContent = "/admin add @bob";
    const extractedValues = extractCommandValues(inputContent, commands, users);
    expect(extractedValues).toEqual({
      command: "admin",
      params: expect.objectContaining({
        type: "add",
        username: expect.arrayContaining([
          expect.objectContaining({
            username: "bob",
          }),
        ]),
      }),
    });
  });

  test("Extract values from /admin remove command", () => {
    const inputContent = "/admin remove @bob";
    const extractedValues = extractCommandValues(inputContent, commands, users);
    expect(extractedValues).toEqual({
      command: "admin",
      params: expect.objectContaining({
        type: "remove",
        username: expect.arrayContaining([
          expect.objectContaining({
            username: "bob",
          }),
        ]),
      }),
    });
  });

  test("Extract values from /admin name command", () => {
    const inputContent = '/admin name "New name"';
    const extractedValues = extractCommandValues(inputContent, commands, users);
    expect(extractedValues).toEqual({
      command: "admin",
      params: expect.objectContaining({
        type: "name",
        name: "New name",
      }),
    });
  });
});