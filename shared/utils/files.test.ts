import { bytesToHumanReadable } from "./files";

describe("bytesToHumanReadable", () => {
  test("Outputs readable string", () => {
    expect(bytesToHumanReadable(0)).toBe("0 Bytes");
    expect(bytesToHumanReadable(500)).toBe("500 Bytes");
    expect(bytesToHumanReadable(1000)).toBe("1 kB");
    expect(bytesToHumanReadable(15000)).toBe("15 kB");
    expect(bytesToHumanReadable(12345)).toBe("12.34 kB");
    expect(bytesToHumanReadable(123456)).toBe("123.45 kB");
    expect(bytesToHumanReadable(1234567)).toBe("1.23 MB");
  });
});
