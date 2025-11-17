import { table } from 'console';
import type { AbstractGenerator } from '../services/Generators.ts';
import type { Prettify } from './tables.ts';

export type TableGeneratorsType = {
	[columnName: string]: Prettify<
		{
			hasSelfRelation?: boolean | undefined;
			hasRelation?: boolean | undefined;
			pRNGSeed: number;
		} & GeneratePossibleGeneratorsColumnType
	>;
};

export type GeneratePossibleGeneratorsColumnType = {
	columnName: string;
	generator: AbstractGenerator<any> | undefined;
	isUnique: boolean;
	notNull: boolean;
	primary: boolean;
	generatedIdentityType?: 'always' | 'byDefault' | undefined;
	wasRefined: boolean;
	wasDefinedBefore: boolean;
	isCyclic: boolean;
};

export type GeneratePossibleGeneratorsTableType = Prettify<{
	tableName: string;
	count?: number;
	withCount?: number;
	withFromTable: {
		[withFromTableName: string]: {
			repeatedValuesCount:
				| number
				| { weight: number; count: number | number[] }[];
			weightedCountSeed?: number;
		};
	};
	// repeatedValuesCount?: number,
	// withFromTableName?: string,
	columnsPossibleGenerators: GeneratePossibleGeneratorsColumnType[];
}>;


export type tablesInOutRelations = Prettify<{
	
		[tableName: string]: {
			out: number;
			in: number;
			selfRelation: boolean;
			selfRelCount: number;
			requiredTableNames: Set<string>;
			dependantTableNames: Set<string>;
		}

}>;

export type RefinementsType = Prettify<{
	[tableName: string]: {
		count?: number;
		columns: { [columnName: string]: AbstractGenerator<{}> };
		//with?: RefinementWithType;
		with?: { [tableName: string]: number | { weight: number; count: number; with?: RefinementsType | number[] }[] };
	};
}>;

export type RefinementWithType = Prettify<{ 
	[tableName: string]: number | { 
		weight: number; 
		count: number; 
		with?: RefinementsType | number[] }[] 
}>;