# Endpoint Mapping

Endpoint [Method]                                          | Description
-----------------------------------------------------------|------------
/                                                          | Homepage/Login
                                                           | 
/{uniqname}                                                | Course creator's page
                                                           | 
/{uniqname}/edit                                           | Edit course creator
/{uniqname} [POST]                                         | Execute course creator edits
/{uniqname}/course                                         | New course form
/{uniqname}/course [POST]                                  | Execute course creation
                                                           | 
/{uniqname}/{course label}                                 | Course page
                                                           | 
/{uniqname}/{course label}/edit                            | Edit course
/{uniqname}/{course label} [POST]                          | Execute course edits
/{uniqname}/{course label}/staff/edit                      | Edit course staff
/{uniqname}/{course label}/staff [POST]                    | Execute course staff edits
/{uniqname}/{course label}/roster/edit                     | Edit course roster
/{uniqname}/{course label}/roster [POST]                   | Execute course roster edits
/{uniqname}/{course label}/assignment                      | New assignment form
/{uniqname}/{course label}/assignment [POST]               | Execute assignment creation
                                                           | 
/{uniqname}/{course label}/{assignment label}              | Assignment page
                                                           | 
/{uniqname}/{course label}/{assignment label}/edit         | Edit assignment
/{uniqname}/{course label}/{assignment label} [POST]       | Execute assignment edits
                                                           | 
/{uniqname}/{course label}/{assignment label}/teams        | Teams page
                                                           | 
/{uniqname}/{course label}/{assignment label}/teams/edit   | Edit teams
/{uniqname}/{course label}/{assignment label}/teams [POST] | Execute team edits
                                                           | 
/h/{hashid}                                                | Shortcut to any page [user.id, course.id, assignment.id, team.id]


Blackout Name    | Object
-----------------|-------
edit             | Course Name
course           | Course Name
edit             | Assignment Name
staff            | Assignment Name
roster           | Assignment Name
assignment       | Assignment Name
