import pandas as pd
import tqdm

filenames = [
    'MERGED2010_11_PP.csv', 'MERGED2020_21_PP.csv'
]

keep_cols = [
    'UNITID', 'OPEID', 'OPEID6', 'INSTNM', 'CITY', 'STABBR', 'ZIP', 'PREDDEG',
    'HIGHDEG', 'LATITUDE', 'LONGITUDE', 'HBCU', 'PBI', 'ANNHI', 'TRIBAL',
    'AANAPII', 'HSI', 'NANTI', 'MENONLY', 'WOMENONLY', 'RELAFFIL', 'ADM_RATE',
    'SAT_AVG', 'UG', 'UGDS_WHITE', 'UGDS_BLACK', 'UGDS_HISP', 'UGDS_ASIAN',
    'UGDS_AIAN', 'UGDS_NHPI', 'CURROPER', 'COSTT4_A', 'COSTT4_P',
    'TUITIONFEE_IN', 'TUITIONFEE_OUT', 'AVGFACSAL', 'C150_4', 'C150_L4',
    'C150_4_WHITE', 'C150_4_BLACK', 'C150_4_HISP', 'C150_4_ASIAN',
    'C150_4_AIAN', 'C150_4_NHPI', 'RET_FTL4', 'RET_PT4', 'PCTFLOAN',
    'FEMALE_DEBT_MDN', 'MALE_DEBT_MDN', 'FIRSTGEN_DEBT_MDN',
    'NOTFIRSTGEN_DEBT_MDN', 'AGE_ENTRY', 'FIRST_GEN', 'FAMINC', 'MD_FAMINC',
    'PRGMOFR', 'CIPCODE1', 'ENDOWBEGIN', 'ENDOWEND', 'MDEARN_ALL', 'SATVR25',
    'SATVR75', 'SATMT25', 'SATMT75', 'SATWR25', 'SATWR75', 'SATVRMID',
    'SATMTMID', 'SATWRMID', 'GRADS'
]

for filename in filenames:
    df = pd.read_csv(filename)

    for (col, _) in tqdm.tqdm(df.iteritems()):
        if not col in keep_cols:
            # print("Dropping {}".format(col))
            df.drop(columns=[col], inplace=True)

    df.to_csv("mod_" + filename)
