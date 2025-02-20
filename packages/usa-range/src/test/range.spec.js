const fs = require("fs");
const path = require("path");
const assert = require("assert");
const range = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "./template.html"));

const EVENTS = {};

/**
 * send a change event
 * @param {HTMLElement} el the element to sent the event to
 */

EVENTS.change = (el) => {
  el.dispatchEvent(new KeyboardEvent("change", { bubbles: true }));
};

const rangeSliderSelector = () => document.querySelector(".usa-range");

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "range slider", selector: rangeSliderSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Range slider with span initialized at ${name}`, () => {
    describe("range slider component", () => {
      const { body } = document;

      let slider;
      let spanElement;
      let wrapperDiv;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        range.on(containerSelector());

        slider = rangeSliderSelector();
        // get the closest slider with class .usa-range__wrapper
        wrapperDiv = slider.closest(".usa-range__wrapper");
        // get the .usa-range__value for the span.
        spanElement = wrapperDiv.querySelector(".usa-range__value");
      });

      afterEach(() => {
        body.textContent = "";
      });

      it("check that the wrapper div is added, the span element is added and that the first child is the range slider and the second child is the span.", () => {
        assert.ok(wrapperDiv, "wrapperDiv was created.");
        assert.ok(spanElement, "SPAN was created");
        // make sure the slider and the span are in the wrapper div and that the span has 20 as the default.
        const children = Array.from(wrapperDiv.children);
        assert.strictEqual(
          children.length,
          2,
          "wrapperDiv doesn't have 2 children",
        );
        assert.strictEqual(
          children[0],
          slider,
          "the range slider is not the first child.",
        );
        assert.strictEqual(
          children[1],
          spanElement,
          "the span is not the second child.",
        );
        assert.strictEqual(
          spanElement.textContent,
          "20",
          "the initial span is not set to 20.",
        );
        
        // we have two range sliders on this page, break them out so we can check them.  
        const sliders = document.querySelectorAll("input[type='range']");
        
        const slider1 = Array.from(sliders).find(slider => slider.getAttribute('min') === "20");
        const wrapper1 = slider1.closest(".usa-range__wrapper");
        // only run this test for document.body
        if (name === "document.body") {
          if (wrapper1) {
            const span1 = wrapper1.querySelector("span");
              assert.strictEqual(
                spanElement.textContent,
                "20",
                "the initial span is not set to 20.",
              );
          } else {
            console.error("Wrapper not found for slider1");
          }
          return;
        };

        const slider2 = Array.from(sliders).find(slider => slider.getAttribute('min') === "30");
        const wrapper2 = slider2.closest(".usa-range__wrapper");
        // only run this test for document.body
        if (name === "document.body") {
          if (wrapper2) {
              assert.strictEqual(
                spanElement.textContent,
                "30",
                "the initial span is not set to 30.",
              );
          } else {
            console.error("Wrapper not found for slider2");
          };
          return;
        };
      });

      it("Updates span element to match new slider value on change", () => {
        slider.value = "40";
        EVENTS.change(slider);
        assert.strictEqual(
          slider.value,
          "40",
          "range slider value is not set to the value in the test.",
        );

        // change the span element, make sure it updated and that the span and the range are equal.
        assert.strictEqual(
          slider.value,
          spanElement.textContent,
          "slider value does not match span value",
        );
      });
    });
  });
});
