var select2LocalData = React.createElement(Select2, { 
    name:'select2Local',
    selected:{ value: 0, text:'select an option'},
    items:[{
        value:1,
        text:'Lvcios'
    },{
        value:2,
        text: 'mjswensen'
    },
    {
        value:3,
        text: 'sdras'
    }]
})

var select2RemoteData = React.createElement(Select2,{
    name:'select2Remote',
    selected:{ value:0, text:''},
    items:[],
    ajax:{
        url: "https://api.github.com/search/users",
        method:"get",
        beforeSend:function (xhr) {
            
        },
        done:function(response, textStatus, jqXHR){
            var results = []
            response.items.forEach(function(item, index){
                results.push({ 
                    value:item.id, text:item.login 
                })
            })
            return results
        }
    }
})

var localSearch = React.createElement('div', { className: 'row' },
                React.createElement('div', { className: 'col-md-12' },
                    React.createElement('div', { className: 'card-box' },
                        React.createElement('form', { role: 'form', action: '#', method: 'post' },
                            React.createElement('div', { className: 'form-group' },
                                React.createElement('label', {}, 'Local search'),
                                    select2LocalData
                            )
                        )
                    )
                )
            )

var remoteSearch = React.createElement('div', { className: 'row' },
                React.createElement('div', { className: 'col-md-12' },
                    React.createElement('div', { className: 'card-box' },
                        React.createElement('form', { role: 'form', action: '#', method: 'post' },
                            React.createElement('div', { className: 'form-group' },
                                React.createElement('label', {}, 'Remote search'),
                                    select2RemoteData
                            )
                        )
                    )
                )
            )
var form = React.createElement('form',{}, localSearch, remoteSearch)

ReactDOM.render(form, document.getElementById('app'))
