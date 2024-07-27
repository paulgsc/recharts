import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
import { ReactElement, SVGProps } from 'react';
import { AxisDomain, AxisDomainType, AxisInterval, AxisTick, DataKey, ScaleType } from '../util/types';
import { RechartsScale } from '../util/ChartUtils';
import { TickFormatter } from '../cartesian/CartesianAxis';

export type AxisId = string | number;
export type XAxisPadding = { left?: number; right?: number } | 'gap' | 'no-gap';
export type YAxisPadding = { top?: number; bottom?: number } | 'gap' | 'no-gap';

export type XAxisOrientation = 'top' | 'bottom';
export type YAxisOrientation = 'left' | 'right';

/**
 * These are the external props, visible for users as they set them using our public API.
 * There is all sorts of internal computed things based on these, but they will come through selectors.
 */
export type AxisSettings = {
  id: AxisId;
  scale: ScaleType | RechartsScale | undefined;
  type: AxisDomainType;
  domain: AxisDomain | undefined;
  allowDataOverflow: boolean;
  /**
   * The axis functionality is severely restricted without a dataKey
   * - but there is still something left, and the prop is optional
   * so this can also be undefined even in real charts.
   * There are no defaults.
   */
  dataKey: DataKey<any> | undefined;
  allowDuplicatedCategory: boolean;
  allowDecimals: boolean;
  tickCount: number;
  interval: AxisInterval;
  includeHidden: boolean;
  reversed: boolean;
  mirror: boolean;
  minTickGap: number;
  angle: number;
  /**
   * Ticks can be any type when the axis is the type of category
   * Ticks must be numbers when the axis is the type of number
   */
  ticks: ReadonlyArray<AxisTick> | undefined;
  hide: boolean;
  unit: string | undefined;
  name: string | undefined;
  tickFormatter: TickFormatter | undefined;
  tick: SVGProps<SVGTextElement> | ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>) | boolean;
};

export type XAxisSettings = AxisSettings & {
  padding: XAxisPadding;
  height: number;
  orientation: XAxisOrientation;
};

export type YAxisSettings = AxisSettings & {
  padding: YAxisPadding;
  width: number;
  orientation: YAxisOrientation;
};

export type ZAxisSettings = {
  id: AxisId;
  dataKey: AxisSettings['dataKey'];
  name: AxisSettings['name'];
  unit: AxisSettings['unit'];
  range: number[];
};

type AxisMapState = {
  xAxis: Record<AxisId, XAxisSettings>;
  yAxis: Record<AxisId, YAxisSettings>;
  zAxis: Record<AxisId, ZAxisSettings>;
};

const initialState: AxisMapState = {
  xAxis: {},
  yAxis: {},
  zAxis: {},
};

/**
 * This is the slice where each individual Axis element pushes its own configuration.
 * Prefer to use this one instead of axisSlice.
 */
const axisMapSlice = createSlice({
  name: 'axisMap',
  initialState,
  reducers: {
    addXAxis(state, action: PayloadAction<XAxisSettings>) {
      state.xAxis[action.payload.id] = castDraft(action.payload);
    },
    removeXAxis(state, action: PayloadAction<XAxisSettings>) {
      delete state.xAxis[action.payload.id];
    },
    addYAxis(state, action: PayloadAction<YAxisSettings>) {
      state.yAxis[action.payload.id] = castDraft(action.payload);
    },
    removeYAxis(state, action: PayloadAction<YAxisSettings>) {
      delete state.yAxis[action.payload.id];
    },
    addZAxis(state, action: PayloadAction<ZAxisSettings>) {
      state.zAxis[action.payload.id] = castDraft(action.payload);
    },
    removeZAxis(state, action: PayloadAction<ZAxisSettings>) {
      delete state.zAxis[action.payload.id];
    },
  },
});

export const { addXAxis, removeXAxis, addYAxis, removeYAxis, addZAxis, removeZAxis } = axisMapSlice.actions;

export const axisMapReducer = axisMapSlice.reducer;
