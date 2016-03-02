# Endpoint Mapping

Endpoint [Method=GET]                                    | Description
---------------------------------------------------------|------------
/                                                        | Homepage/Login
                                                         | 
/{uniqname}                                              | Course creator's page
                                                         | 
/{uniqname} [POST]                                       | Execute course creator edits
/{uniqname}/edit                                         | Edit course creator
                                                         | 
/{uniqname}/course                                       | New course form
/{uniqname}/course [POST]                                | Execute course creation
/{uniqname}/{courseLabel}                                | Course page
                                                         | 
/{uniqname}/{courseLabel} [POST]                         | Execute course edits
/{uniqname}/{courseLabel}/edit                           | Edit course
/{uniqname}/{courseLabel}/staff [POST]                   | Execute course staff edits
/{uniqname}/{courseLabel}/staff/edit                     | Edit course staff
/{uniqname}/{courseLabel}/roster [POST]                  | Execute course roster edits
/{uniqname}/{courseLabel}/roster/edit                    | Edit course roster
                                                         | 
/{uniqname}/{courseLabel}/assignment                     | New assignment form
/{uniqname}/{courseLabel}/assignment [POST]              | Execute assignment creation
/{uniqname}/{courseLabel}/{assignmentLabel}              | Assignment page
                                                         | 
/{uniqname}/{courseLabel}/{assignmentLabel} [POST]       | Execute assignment edits
/{uniqname}/{courseLabel}/{assignmentLabel}/edit         | Edit assignment
                                                         | 
/{uniqname}/{courseLabel}/{assignmentLabel}/teams        | Teams page
                                                         | 
/{uniqname}/{courseLabel}/{assignmentLabel}/teams [POST] | Execute team edits
/{uniqname}/{courseLabel}/{assignmentLabel}/teams/edit   | Edit teams
                                                         | 
/h/{hashid}                                              | Shortcut to any page [user.id, course.id, assignment.id, team.id]


Blackout Name    | Object
-----------------|-------
edit             | Course Name
course           | Course Name
edit             | Assignment Name
staff            | Assignment Name
roster           | Assignment Name
assignment       | Assignment Name
