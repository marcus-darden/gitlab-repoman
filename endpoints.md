# Endpoint Mapping

Endpoint [Method]                                            | Description
-------------------------------------------------------------|------------
/                                                            | Homepage/Login
                                                             | 
/{uniqname}                                                  | Course creator's page
                                                             | 
/e/{uniqname}                                                | Edit course creator
/e/{uniqname} [POST]                                         | Execute course creator edits
/e/{uniqname}/course/new                                     | New course form
/e/{uniqname}/course/new [POST]                              | Execute course creation
                                                             | 
/{uniqname}/{course label}                                   | Course page
                                                             | 
/{uniqname}/e/{course label}                                 | Edit course
/{uniqname}/e/{course label} [POST]                          | Execute course edits
/{uniqname}/e/{course label}/staff                           | Edit course staff
/{uniqname}/e/{course label}/staff [POST]                    | Execute course staff edits
/{uniqname}/e/{course label}/roster                          | Edit course roster
/{uniqname}/e/{course label}/roster [POST]                   | Execute course roster edits
/{uniqname}/e/{course label}/assignment/new                  | New assignment form
/{uniqname}/e/{course label}/assignment [POST]               | Execute assignment creation
                                                             | 
/{uniqname}/{course label}/{assignment label}                | Assignment page
                                                             | 
/{uniqname}/{course label}/e/{assignment label}              | Edit assignment
/{uniqname}/{course label}/e/{assignment label} [POST]       | Execute assignment edits
/{uniqname}/{course label}/e/{assignment label}/teams        | Edit teams
/{uniqname}/{course label}/e/{assignment label}/teams [POST] | Execute team edits
