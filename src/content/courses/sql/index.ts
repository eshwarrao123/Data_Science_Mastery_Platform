import { registerCourse } from "@/lib/curriculum/registry";
import { sqlCourse } from "./course";
import { foundationsModule } from "./modules/foundations/module";
import { whatIsADatabase } from "./modules/foundations/lessons/what-is-a-database";
import { selectAndFrom } from "./modules/foundations/lessons/select-and-from";
import { whereAndFiltering } from "./modules/foundations/lessons/where-and-filtering";
import { orderByAndLimit } from "./modules/foundations/lessons/order-by-and-limit";
import { aggregateFunctions } from "./modules/foundations/lessons/aggregate-functions";
import { groupByAndHaving } from "./modules/foundations/lessons/group-by-and-having";
import { joinsModule } from "./modules/joins/module";
import { innerJoin } from "./modules/joins/lessons/inner-join";
import { leftAndRightJoins } from "./modules/joins/lessons/left-and-right-joins";
import { fullOuterJoin } from "./modules/joins/lessons/full-outer-join";
import { selfJoins } from "./modules/joins/lessons/self-joins";
import { multipleJoins } from "./modules/joins/lessons/multiple-joins";
import { advancedModule } from "./modules/advanced/module";
import { subqueries } from "./modules/advanced/lessons/subqueries";
import { ctes } from "./modules/advanced/lessons/ctes";
import { windowFunctionsSql } from "./modules/advanced/lessons/window-functions-sql";
import { caseStatements } from "./modules/advanced/lessons/case-statements";
import { stringAndDateFunctions } from "./modules/advanced/lessons/string-and-date-functions";
import { designModule } from "./modules/design/module";
import { databaseDesignConcepts } from "./modules/design/lessons/database-design-concepts";
import { normalization } from "./modules/design/lessons/normalization";
import { indexesAndOptimization } from "./modules/design/lessons/indexes-and-optimization";
import { transactionsAndAcid } from "./modules/design/lessons/transactions-and-acid";
import { analysisModule } from "./modules/analysis/module";
import { sqlForEda } from "./modules/analysis/lessons/sql-for-eda";
import { projectSqlBusinessAnalysis } from "./modules/analysis/lessons/project-sql-business-analysis";

registerCourse(sqlCourse, [
  {
    module: foundationsModule,
    lessons: [
      whatIsADatabase,
      selectAndFrom,
      whereAndFiltering,
      orderByAndLimit,
      aggregateFunctions,
      groupByAndHaving,
    ],
  },
  {
    module: joinsModule,
    lessons: [
      innerJoin,
      leftAndRightJoins,
      fullOuterJoin,
      selfJoins,
      multipleJoins,
    ],
  },
  {
    module: advancedModule,
    lessons: [
      subqueries,
      ctes,
      windowFunctionsSql,
      caseStatements,
      stringAndDateFunctions,
    ],
  },
  {
    module: designModule,
    lessons: [
      databaseDesignConcepts,
      normalization,
      indexesAndOptimization,
      transactionsAndAcid,
    ],
  },
  {
    module: analysisModule,
    lessons: [sqlForEda, projectSqlBusinessAnalysis],
  },
]);
