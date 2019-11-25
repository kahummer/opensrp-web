import moment from 'moment';
import React, { useEffect, useState } from 'react';

/** enumerable values for time unit */
export enum TimeUnit {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

/** interface for how filtered data will be passed back to the calling
 * component or to a display component via render props
 */
interface GroupedFilters<T, FilterState> {
  /** the parent state, will include current filters and data */
  parentFilterState: FilterState;
  /** chunk of original data that is now currently filtered subject to
   * info in the meta
   */
  filteredData: T[];

  /** meta information regarding the filter applied to above data */
  meta: {
    /** describes the numeric part of the period under which the filtered
     * data was filtered
     */
    timeLength: number;

    /** The category value */
    category: string;

    /** describes the unit part of the period under which the filtered
     * data was filtered
     */
    timeUnit: string;
  };
  /** an id to uniquely identify this filter if added to the parentFilterState */
  filterId: string;

  /** a dynamically generated filter function to be used */
  filterFunction: (data: T) => boolean;
}

/** Type interface for duration */
interface DurationType {
  /** amount in integers  */
  timeLength: number;
  /** time unit e.g. 'hours', 'minutes' you get it. */
  timeUnit: TimeUnit;
}

/** props for FilterCardsCategorizer component */
export interface Props<T, FilterState> {
  /** the whole filter state passed from the rendering parent component */
  parentFilterState: FilterState;

  /** an array of the records that are getting filtered, the filtration
   * will be done on one of the properties of each object in the data array
   */
  data: T[];

  /** the string value of the property which the data should be filtered with
   * respect to
   */
  accessor: string;

  /** An array of duration objects; works as a form of pseudo filter
   * helping zero down further ; filters based on a time period
   */
  periods: DurationType[];

  /** property name where data[idx].[<timeAccessor>] will represent the values
   * which will be subject to filtering based on the periods
   */
  timeAccessor: string;

  /** unique values ; part of the enumerable values of the accessor field
   * data will be filtered based on at-least on of these values
   */
  categories: Set<string>;

  /** render prop accepts a function that is given data of type GroupedFilters
   * then it can supply a custom interface to display the results
   */
  renderCard?: (groupedFilters: Array<GroupedFilters<T, FilterState>>) => JSX.Element;
}

/** default props for the categorizer component */
export const defaultProps: Props<{}, {}> = {
  accessor: '',
  categories: new Set(['']),
  data: [],
  parentFilterState: {},
  periods: [{ timeLength: 1, timeUnit: TimeUnit.WEEK }, { timeLength: 2, timeUnit: TimeUnit.WEEK }],
  timeAccessor: '',
};

/** the FilterCardsCategorizer component */
function FilterCardsCategorizer<T, FilterState>(props: Props<T, FilterState>) {
  const {
    periods,
    data,
    timeAccessor: timeField,
    accessor: categoryField,
    categories,
    renderCard,
  } = props;
  const [groupedFilters, setGroupedFilters] = useState<Array<GroupedFilters<T, FilterState>>>([]);

  setGroupedFilters(
    groupFilterData<T, FilterState>(
      periods,
      data,
      categories,
      categoryField,
      timeField,
      props.parentFilterState
    )
  );
  return renderCard && renderCard(groupedFilters);
}

/** creates an object showing how the data was filtered
 * based on the periods and the category field passed in as props
 * @param {DurationType} periods - filter based on this periods
 * @param {data} {T[]} - the original unfiltered data
 * @param {categories} - Filter data with respect to this categories
 * @param {string} categoryField - Filter data with respect to above categories for this property name
 * @param {string} timeField - property name for field that holds the eta data for each data obj.
 */
export function groupFilterData<T, FilterState>(
  periods: DurationType[],
  data: T[],
  categories: Set<string>,
  categoryField: string,
  timeField: string,
  parentFilterState: any
): Array<GroupedFilters<T, FilterState>> {
  const filteredData: Array<GroupedFilters<T, FilterState>> = [];
  // TODO - the period is in the form given by the server, need to parse that in an identifible format.
  periods.forEach(period => {
    categories.forEach(category => {
      const filterFunction = (entry: any) =>
        entry[categoryField] === category && isInPeriod<T>(entry, period, timeField);

      const processedData = data.filter(dataObj => filterFunction(dataObj));
      filteredData.push({
        filterFunction,
        filterId: 'FILTER_CARDS',
        filteredData: processedData,
        meta: {
          category,
          ...period,
        },
        parentFilterState,
      });
    });
  });
  return filteredData;
}

/** returns boolean showing whether the data object timeField's value
 * is in between the Date.now through to Date.now + period
 * @param {T} dataObj - object describing event
 * @param {DurationType} period - data object can be within or without now to end of given period
 * @param {string} timeField - dataObj[timeField]'s value shows when dataObj event will be done
 * @param {string | null} startPeriod - changes the point from which we decide the period starts
 */
export function isInPeriod<T>(
  dataObj: T,
  period: DurationType,
  timeField: string,
  startPeriod: string | null = null
): boolean {
  const now = moment(startPeriod ? startPeriod : {});
  const dataObjEta = moment((dataObj as any)[timeField]);
  /** duration to end of period */
  const periodBounds = moment.duration(period.timeLength, period.timeUnit);
  /** eta to the event described by data object */
  const timeToDataObjEta = moment.duration(dataObjEta.diff(now));

  // if timeToDataObjEta is less that the periodBound duration, means
  // DataObj event is within the given period otherwise without
  return timeToDataObjEta <= periodBounds;
}
