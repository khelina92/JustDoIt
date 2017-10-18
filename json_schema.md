DataStructure
-------------------

Schema: 
{
    higscores:{
        "type":"array"
        "items":[
            {
             "name":{"type":"string"},
             "score":{"type":"integer"},
             "timestamp":{"type":"string"}  
            }
        ]
    }
}

Example: 
{
    highscores:[
        {"name":"Christian", "score":100, "timestamp":"123456789"}
    ]
}