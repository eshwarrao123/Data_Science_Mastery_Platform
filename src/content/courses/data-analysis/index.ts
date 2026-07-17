import { registerCourse } from "@/lib/curriculum/registry";
import { dataAnalysisCourse } from "./course";
import { pandasCoreModule } from "./modules/pandas-core/module";
import { pandasDataframes } from "./modules/pandas-core/lessons/pandas-dataframes";
import { seriesAndIndex } from "./modules/pandas-core/lessons/series-and-index";
import { dataSelection } from "./modules/pandas-core/lessons/data-selection";
import { addingModifyingColumns } from "./modules/pandas-core/lessons/adding-modifying-columns";
import { handlingMissingData } from "./modules/pandas-core/lessons/handling-missing-data";
import { sortingAndRanking } from "./modules/pandas-core/lessons/sorting-and-ranking";
import { cleaningModule } from "./modules/cleaning/module";
import { commonDataQualityIssues } from "./modules/cleaning/lessons/common-data-quality-issues";
import { detectingHandlingNulls } from "./modules/cleaning/lessons/detecting-handling-nulls";
import { deduplication } from "./modules/cleaning/lessons/deduplication";
import { typeCoercion } from "./modules/cleaning/lessons/type-coercion";
import { stringCleaning } from "./modules/cleaning/lessons/string-cleaning";
import { outlierDetection } from "./modules/cleaning/lessons/outlier-detection";
import { transformationModule } from "./modules/transformation/module";
import { groupbyAndAggregation } from "./modules/transformation/lessons/groupby-and-aggregation";
import { reshapingPivotMelt } from "./modules/transformation/lessons/reshaping-pivot-melt";
import { mergingAndJoining } from "./modules/transformation/lessons/merging-and-joining";
import { windowFunctions } from "./modules/transformation/lessons/window-functions";
import { applyAndTransform } from "./modules/transformation/lessons/apply-and-transform";
import { edaModule } from "./modules/eda/module";
import { edaWorkflow } from "./modules/eda/lessons/eda-workflow";
import { univariateAnalysis } from "./modules/eda/lessons/univariate-analysis";
import { bivariateAnalysis } from "./modules/eda/lessons/bivariate-analysis";
import { multivariateAnalysis } from "./modules/eda/lessons/multivariate-analysis";
import { projectEdaRealDataset } from "./modules/eda/lessons/project-eda-real-dataset";

registerCourse(dataAnalysisCourse, [
  {
    module: pandasCoreModule,
    lessons: [
      pandasDataframes,
      seriesAndIndex,
      dataSelection,
      addingModifyingColumns,
      handlingMissingData,
      sortingAndRanking,
    ],
  },
  {
    module: cleaningModule,
    lessons: [
      commonDataQualityIssues,
      detectingHandlingNulls,
      deduplication,
      typeCoercion,
      stringCleaning,
      outlierDetection,
    ],
  },
  {
    module: transformationModule,
    lessons: [
      groupbyAndAggregation,
      reshapingPivotMelt,
      mergingAndJoining,
      windowFunctions,
      applyAndTransform,
    ],
  },
  {
    module: edaModule,
    lessons: [
      edaWorkflow,
      univariateAnalysis,
      bivariateAnalysis,
      multivariateAnalysis,
      projectEdaRealDataset,
    ],
  },
]);
