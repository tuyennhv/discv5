/* eslint-env mocha */
import { expect } from "chai";
import { Multiaddr } from "multiaddr";
import { ENR, v4 } from "../src/enr";

describe("ENR", () => {
  let seq: bigint;
  let privateKey: Buffer;
  let record: ENR;

  beforeEach(() => {
    seq = 1n;
    privateKey = Buffer.from("b71c71a67e1177ad4e901695e1b4b9ee17ae16c6668d313eac2f96dbcda3f291", "hex");
    record = ENR.createV4(v4.publicKey(privateKey));
    record.set("ip", Buffer.from("7f000001", "hex"));
    record.set("udp", Buffer.from((30303).toString(16), "hex"));
    record.seq = seq;
  });

  it("should properly compute the node id", () => {
    expect(record.nodeId).to.equal("a448f24c6d18e575453db13171562b71999873db5b286df957af199ec94617f7");
  });

  it("should encode/decode to RLP encoding", () => {
    const decoded = ENR.decode(record.encode(privateKey));
    expect(decoded).to.deep.equal(record);
  });

  it("should encode/decode to text encoding", () => {
    // spec enr https://eips.ethereum.org/EIPS/eip-778
    const testTxt =
      "enr:-IS4QHCYrYZbAKWCBRlAy5zzaDZXJBGkcnh4MHcBFZntXNFrdvJjX04jRzjzCBOonrkTfj499SZuOh8R33Ls8RRcy5wBgmlkgnY0gmlwhH8AAAGJc2VjcDI1NmsxoQPKY0yuDUmstAHYpMa2_oxVtw0RW_QAdpzBQA8yWM0xOIN1ZHCCdl8";
    const decoded = ENR.decodeTxt(testTxt);
    expect(decoded.udp).to.be.equal(30303);
    expect(decoded.ip).to.be.equal("127.0.0.1");
    expect(decoded).to.deep.equal(record);
    expect(record.encodeTxt(privateKey)).to.equal(testTxt);
  });
});
describe("ENR Multiformats support", () => {
  let seq: bigint;
  let privateKey: Buffer;
  let record: ENR;

  beforeEach(() => {
    seq = 1n;
    privateKey = Buffer.from("b71c71a67e1177ad4e901695e1b4b9ee17ae16c6668d313eac2f96dbcda3f291", "hex");
    record = ENR.createV4(v4.publicKey(privateKey));
  });

  it("should get / set UDP multiaddr", () => {
    const multi0 = new Multiaddr("/ip4/127.0.0.1/udp/30303");
    const tuples0 = multi0.tuples();

    if (!tuples0[0][1] || !tuples0[1][1]) {
      throw new Error('invalid multiaddr')
    }
    // set underlying records
    record.set("ip", tuples0[0][1]);
    record.set("udp", tuples0[1][1]);
    // and get the multiaddr
    expect(record.getLocationMultiaddr("udp")!.toString()).to.equal(multi0.toString());
    // set the multiaddr
    const multi1 = new Multiaddr("/ip4/0.0.0.0/udp/30300");
    record.setLocationMultiaddr(multi1);
    // and get the multiaddr
    expect(record.getLocationMultiaddr("udp")!.toString()).to.equal(multi1.toString());
    // and get the underlying records
    const tuples1 = multi1.tuples();
    expect(record.get("ip")).to.deep.equal(tuples1[0][1]);
    expect(record.get("udp")).to.deep.equal(tuples1[1][1]);
  });
  it("should get / set TCP multiaddr", () => {
    const multi0 = new Multiaddr("/ip4/127.0.0.1/tcp/30303");
    const tuples0 = multi0.tuples();

    if (!tuples0[0][1] || !tuples0[1][1]) {
      throw new Error('invalid multiaddr')
    }

    // set underlying records
    record.set("ip", tuples0[0][1]);
    record.set("tcp", tuples0[1][1]);
    // and get the multiaddr
    expect(record.getLocationMultiaddr("tcp")!.toString()).to.equal(multi0.toString());
    // set the multiaddr
    const multi1 = new Multiaddr("/ip4/0.0.0.0/tcp/30300");
    record.setLocationMultiaddr(multi1);
    // and get the multiaddr
    expect(record.getLocationMultiaddr("tcp")!.toString()).to.equal(multi1.toString());
    // and get the underlying records
    const tuples1 = multi1.tuples();
    expect(record.get("ip")).to.deep.equal(tuples1[0][1]);
    expect(record.get("tcp")).to.deep.equal(tuples1[1][1]);
  });
});
