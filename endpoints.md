# Endpoint Mapping

Endpoint [Method]                                            | Description
-------------------------------------------------------------|------------
/                                                            | Homepage/Login
/u/{uniqname}                                                | Course creator's page
/u/{uniqname}/courses/new                                    | New course form
/u/{uniqname}/courses [POST]                                 | Execute course creation
/{uniqname}/{course label}                                   | Course page
/{uniqname}/{course label} [POST]                            | Execute course edits
/{uniqname}/{course label}/edit                              | Edit course
/{uniqname}/{course label}/staff                             | Edit course staff
/{uniqname}/{course label}/staff [POST]                      | Execute course staff edits
/{uniqname}/{course label}/roster                            | Edit course roster
/{uniqname}/{course label}/roster [POST]                     | Execute course roster edits
/{uniqname}/{course label}/assignments/new                   | New assignment form
/{uniqname}/{course label}/assignments [POST]                | Execute assignment creation
/{uniqname}/{course label}/a/{assignment label}              | Assignment page
/{uniqname}/{course label}/a/{assignment label} [POST]       | Execute assignment edits
/{uniqname}/{course label}/a/{assignment label}/edit         | Edit assignment
/{uniqname}/{course label}/a/{assignment label}/teams        | Edit teams
/{uniqname}/{course label}/a/{assignment label}/teams [POST] | Execute team edits
