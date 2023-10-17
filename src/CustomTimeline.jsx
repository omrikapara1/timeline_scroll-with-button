import React, { useState } from "react";
import moment from "moment";

import Timeline from "react-calendar-timeline";

import generateFakeData from "./generate-fake-data";

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end"
};

export const CustomTimeline = () => {
  const [scrollRef, setScrollRef] = useState();
  const { groups, items } = generateFakeData();
  const defaultTimeStart = moment()
    .startOf("day")
    .toDate();
  const defaultTimeEnd = moment()
    .startOf("day")
    .add(1, "day")
    .toDate();

  const animateScroll = invert => {
    const width = (invert ? -1 : 1) * parseFloat(scrollRef.style.width); // cos curve in both directions
    const duration = 2000;

    const startTime = performance.now();
    let lastWidth = 0;
    const animate = () => {
      let normalizedTime = (performance.now() - startTime) / duration;
      if (normalizedTime > 1) {
        // not overanimate
        normalizedTime = 1;
      }

      // http://www.wolframalpha.com/input/?i=plot+0.5+(1%2Bcos(%CF%80+(x-1)))*1000+from+0+to+1 --> 1000 is the simulated width
      const calculatedWidth = Math.floor(
        width * 0.5 * (1 + Math.cos(Math.PI * (normalizedTime - 1)))
      );
      scrollRef.scrollLeft += calculatedWidth - lastWidth;
      lastWidth = calculatedWidth;

      if (normalizedTime < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const onPrevClick = () => {
    animateScroll(true);
  };

  const onNextClick = () => {
    animateScroll(false);
  };

  const sr = (el) => {
    console.log({el})
    setScrollRef(el)
  };


    return (
      <div>
        <Timeline
          scrollRef={sr}
          groups={groups}
          items={items}
          keys={keys}
          sidebarContent={<div>Above The Left</div>}
          itemsSorted
          itemTouchSendsClick={false}
          stackItems
          itemHeightRatio={0.75}
          showCursorLine
          canMove={false}
          canResize={false}
          defaultTimeStart={defaultTimeStart}
          defaultTimeEnd={defaultTimeEnd}
        />
        <button onClick={onPrevClick}>{"< Prev"}</button>
        <button onClick={onNextClick}>{"Next >"}</button>
      </div>
    );
}
