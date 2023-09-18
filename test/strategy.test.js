import assert from "assert";
import {
  isWhitelisted,
  shouldFetchPrice,
  shouldBuy,
  getMaxPrice,
  couldBeBought,
  couldBeSold,
} from "../strategy/index";

describe("Strategy", () => {
  describe("GetMaxPrice", () => {
    it("max price is 0.05", () => {
      const maxPrice = getMaxPrice();
      assert.equal(0.05, maxPrice);
    });
  });

  describe("isWhitelisted", () => {
    it("zmzimpl is in whitelisted", () => {
      const isInWhitelist = isWhitelisted({ username: "zmzimpl", price: 0.01 });
      assert.equal(true, Boolean(isInWhitelist));
    });
    it("FTDetector is not in whitelisted", () => {
      const isInWhitelist = isWhitelisted({
        username: "FTDetector",
        price: 1.5,
      });
      assert.equal(false, Boolean(isInWhitelist));
    });
  });

  describe("couldBeBought", () => {
    it("Shouldn't buy 0x769dd66767ab8569cedacc11c3165706171ca86b ", () => {
      const isCouldBeBought = couldBeBought(
        "0x769dd66767ab8569cedacc11c3165706171ca86b"
      );
      assert.equal(false, isCouldBeBought);
    });
    it("0x634b5B0D940f6A4C48d5E6180a47EBb543a23F46 in not in block list ", () => {
      const isCouldBeBought = couldBeBought(
        "0x634b5B0D940f6A4C48d5E6180a47EBb543a23F46"
      );
      assert.equal(true, isCouldBeBought);
    });
  });
  describe("couldBeSold", () => {
    it("Shouldn't sell 0x634b5B0D940f6A4C48d5E6180a47EBb543a23F46 ", () => {
      const isCouldBeSold = couldBeSold(
        "0x634b5B0D940f6A4C48d5E6180a47EBb543a23F46",
        "0x634b5B0D940f6A4C48d5E6180a47EBb543a23f46"
      );
      assert.equal(false, isCouldBeSold);
    });
    it("0x769dd66767ab8569cedacc11c3165706171ca86b could be sold ", () => {
      const isCouldBeSold = couldBeSold(
        "0x634b5B0D940f6A4C48d5E6180a47EBb543a23F46",
        "0x769dd66767ab8569cedacc11c3165706171ca86b"
      );
      assert.equal(true, isCouldBeSold);
    });
  });

  describe("shouldFetchPrice", () => {
    it("Shouldn't fetch price if not in whitelist and not met conditions", () => {
      const ifShouldFetchPrice = shouldFetchPrice(
        { bridgedAmount: 0.11, nonce: 1000 },
        { followers: 176, posts: 272 },
        { username: "FTDetector", price: 0.001 }
      );
      assert.equal(false, ifShouldFetchPrice);
    });
    it("Should fetch price if not in whitelist, but met all conditions", () => {
      const ifShouldFetchPrice = shouldFetchPrice(
        { bridgedAmount: 0.31, nonce: 1 },
        { followers: 17600, posts: 272 },
        { username: "FTDetector", price: 0.0001 }
      );
      assert.equal(true, ifShouldFetchPrice);
    });
    it("Should fetch price if in whitelist, but previous price met price condition", () => {
      const ifShouldFetchPrice = shouldFetchPrice(
        { bridgedAmount: 0.11, nonce: 1000 },
        { followers: 176, posts: 272 },
        { username: "zmzimpl", price: 0.0001 }
      );
      assert.equal(true, ifShouldFetchPrice);
    });
    it("Shouldn't fetch price if in whitelist, but not met all conditions", () => {
      const ifShouldFetchPrice = shouldFetchPrice(
        { bridgedAmount: 0.11, nonce: 1000 },
        { followers: 176, posts: 272 },
        { username: "zmzimpl", price: 0.01 }
      );
      assert.equal(false, ifShouldFetchPrice);
    });
  });

  describe("shouldBuy", () => {
    it("Shouldn't buy zmzimpl. If price higher than 0.0005", () => {
      const ifShouldBuy = shouldBuy(
        { bridgedAmount: 0.11, nonce: 1000 },
        { followers: 176, posts: 272 },
        { username: "zmzimpl", price: 0.001 }
      );
      assert.equal(false, ifShouldBuy);
    });
    it("Should buy zmzimpl. If price lower than 0.0005", () => {
      const ifShouldBuy = shouldBuy(
        { bridgedAmount: 0.11, nonce: 1000 },
        { followers: 176, posts: 272 },
        { username: "zmzimpl", price: 0.0001 }
      );
      assert.equal(true, ifShouldBuy);
    });
    it("Shouldn't buy FTDetector. Price > 0.0004, bridgedAmount > 0.1, nonce < 2, follower > 5000, posts > 100", () => {
      const ifShouldBuy = shouldBuy(
        { bridgedAmount: 0.21, nonce: 0 },
        { followers: 17600, posts: 272 },
        { username: "FTDetector", price: 0.0005 }
      );
      assert.equal(false, ifShouldBuy);
    });
    it("Shouldn't buy FTDetector. Price < 0.0004, bridgedAmount < 0.1, nonce < 5, follower > 5000, posts > 100", () => {
      const ifShouldBuy = shouldBuy(
        { bridgedAmount: 0.01, nonce: 0 },
        { followers: 17600, posts: 272 },
        { username: "FTDetector", price: 0.0001 }
      );
      assert.equal(false, ifShouldBuy);
    });
    it("Shouldn't buy FTDetector. Price < 0.0004, bridgedAmount > 0.1, nonce > 5, follower > 5000, posts > 100", () => {
      const ifShouldBuy = shouldBuy(
        { bridgedAmount: 0.21, nonce: 6 },
        { followers: 17600, posts: 272 },
        { username: "FTDetector", price: 0.0001 }
      );
      assert.equal(false, ifShouldBuy);
    });
    it("Shouldn't buy FTDetector. Price < 0.0004, bridgedAmount > 0.1, nonce < 5, follower < 5000, posts > 100", () => {
      const ifShouldBuy = shouldBuy(
        { bridgedAmount: 0.21, nonce: 0 },
        { followers: 176, posts: 272 },
        { username: "FTDetector", price: 0.0001 }
      );
      assert.equal(false, ifShouldBuy);
    });
    it("Shouldn't buy FTDetector. Price < 0.0004, bridgedAmount > 0.1, nonce < 5, follower > 5000, posts < 100", () => {
      const ifShouldBuy = shouldBuy(
        { bridgedAmount: 0.21, nonce: 0 },
        { followers: 17600, posts: 72 },
        { username: "FTDetector", price: 0.0001 }
      );
      assert.equal(false, ifShouldBuy);
    });
    it("Should buy FTDetector. Price < 0.0004, bridgedAmount > 0.1, nonce < 5, follower > 5000, posts > 100", () => {
      const ifShouldBuy = shouldBuy(
        { bridgedAmount: 0.21, nonce: 0 },
        { followers: 17600, posts: 210 },
        { username: "FTDetector", price: 0.0001 }
      );
      assert.equal(true, ifShouldBuy);
    });
  });
});