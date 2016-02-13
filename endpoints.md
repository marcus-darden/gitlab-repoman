# Endpoint Mapping

Endpoint [Method]                                            | Description
-------------------------------------------------------------|------------
/                                                            | Homepage/Login
                                                             | 
/{uniqname}                                                  | Course creator's page
                                                             | 
/{uniqname}/e                                                | Edit course creator
/{uniqname}/e [POST]                                         | Execute course creator edits
/{uniqname}/e/course/new                                     | New course form
/{uniqname}/e/course/new [POST]                              | Execute course creation
                                                             | 
/{uniqname}/{course label}                                   | Course page
                                                             | 
/{uniqname}/{course label}/e                                 | Edit course
/{uniqname}/{course label}/e [POST]                          | Execute course edits
/{uniqname}/{course label}/e/staff                           | Edit course staff
/{uniqname}/{course label}/e/staff [POST]                    | Execute course staff edits
/{uniqname}/{course label}/e/roster                          | Edit course roster
/{uniqname}/{course label}/e/roster [POST]                   | Execute course roster edits
/{uniqname}/{course label}/e/assignment/new                  | New assignment form
/{uniqname}/{course label}/e/assignment [POST]               | Execute assignment creation
                                                             | 
/{uniqname}/{course label}/{assignment label}                | Assignment page
                                                             | 
/{uniqname}/{course label}/{assignment label}/e              | Edit assignment
/{uniqname}/{course label}/{assignment label}/e [POST]       | Execute assignment edits
/{uniqname}/{course label}/{assignment label}/e/teams        | Edit teams
/{uniqname}/{course label}/{assignment label}/e/teams [POST] | Execute team edits
