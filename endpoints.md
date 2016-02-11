# Endpoint Mapping

Endpoint [Method]                                      | Description
-------------------------------------------------------|------------
/                                                      | Homepage/Login
/u/{uniqname}                                          | Course creator's page
/{uniqname}/{course label}                             | Course page
/{uniqname}/{course label} [POST]                      | Execute course edits
/{uniqname}/{course label}/edit                        | Edit course
/{uniqname}/{course label}/staff                       | Edit course staff
/{uniqname}/{course label}/staff [POST]                | Execute course staff edits
/{uniqname}/{course label}/a/{assignment label}        | Assignment page
/{uniqname}/{course label}/a/{assignment label} [POST] | Execute assignment edits
/{uniqname}/{course label}/a/{assignment label}/edit   | Edit assignment
/courses/new                                           | New course form
/courses [POST]                                        | Execute course creation
/assignments/new                                       | New assignment form
/assignments [POST]                                    | Execute assignment creation
