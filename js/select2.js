class Select2 extends React.Component {
    constructor(props) {
        super(props)
        this.showSearchInput = this.showSearchInput.bind(this)
        this.onChangeSearchValue = this.onChangeSearchValue.bind(this)
        this.renderSearchResults = this.renderSearchResults.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.selectValue = this.selectValue.bind(this)
        this.state = {
            showInput: false,
            searchValue: '',
            searchResults: this.props.items,
            filteredResults:[],
            selectedValue: this.props.selected.value,
            selectedText: this.props.selected.text,
            helpText: 'Please enter 3 or more characters'
        }
    }

    componentDidMount(){
        if(this.state.ajax == null || this.state.ajax == undefined){
            this.setState({
                filteredResults:this.state.searchResults
            })
        }
        else{
            this.setState({
                searchResults:[],
                filteredResults:[]
            })
        }
    }

    selectValue(event) {
        var selectedValue = event.target.getAttribute('data-value')
        var selectedText = event.target.getAttribute('data-text')
        this.setState({
            selectedValue: selectedValue,
            selectedText: selectedText,
            showInput: false,
            searchValue: '',
            helpText: 'Please enter 3 or more characters'
        })

    }

    renderSearchResults() {
        if (this.state.filteredResults.length == 0) {
            return React.createElement('li', { className: 'select2-results__option select2-results__message', role: 'treeitem', 'aria-live': 'assertive' }, this.state.helpText)
        }
        else {
            var results = []
            var name = this.props.name
            var selectValue = this.selectValue
            this.state.filteredResults.forEach(function (item, index) {
                results.push(React.createElement('li', {
                    key: name + 'result-' + index,
                    className: 'select2-results__option',
                    role: 'treeitem',
                    'aria-selected': false,
                    'data-value': item.value,
                    'data-text': item.text,
                    'data-name': name,
                    onClick: selectValue
                }, item.text))
            })
            return results
        }
    }

    onChangeSearchValue(event) {
        this.setState({ searchValue: event.target.value })
        var searchValue = event.target.value
        if (searchValue.length >= 3) {
            this.setState({ helpText: 'Searching for ' + searchValue })
            var regex = new RegExp('.' + searchValue + '.*')
            if(this.props.ajax == undefined || this.props.ajax == null){
                var filteredSearchResults = this.state.searchResults.filter(function(item){
                    return item.text.match(regex)
                })
                this.setState({
                    filteredResults:filteredSearchResults
                })
            }
            else{
                remoteSearchSelect2(searchValue, this.props.ajax, this.updateSearchResults)
            }
        }
        else {
            console.log(this.state)
            this.setState({ 
                helpText: 'Please enter 3 or more characters' ,
                filteredResults:this.state.searchResults
            })
        }
    }

    updateSearchResults(results) {
        var helpText = ''
        if (results.length == 0) {
            helpText = 'No results for ' + this.state.searchValue
        }
        this.setState({
            filteredResults: results,
            helpText: helpText
        })
    }

    showSearchInput() {
        var showInput = this.state.showInput
        this.setState({ showInput: !showInput })
        if (!showInput) {
            var inputId = 'select2-search__field-' + this.props.name
            setTimeout(function () { document.getElementById(inputId).focus() }, 100)
        }
    }

    render() {
        return React.createElement('div', {}, React.createElement('span', { className: 'select2 select2-container select2-container--default select2-container--below select2-container--focus', dir: "ltr", style: { width: '100%' }, onClick: this.showSearchInput, id: 'select2-' + this.props.name },
            React.createElement('span', { className: 'selection' },
                React.createElement('span', { className: 'select2-selection select2-selection--single', role: 'combobox', 'aria-haspopup': 'true', 'aria-expanded': 'false', tabIndex: 0, 'aria-labelledby': 'select2-agencyId-gt-container' },
                    React.createElement('span', { className: 'select2-selection__rendered' },
                        this.state.selectedValue != 0 ? this.state.selectedText : React.createElement('span', { className: 'select2-selection__placeholder' }, this.props.searchText)),
                        React.createElement('span', { className: 'select2-selection__arrow', role: 'presentation' }, React.createElement('b', { role: 'presentation' }))
                )),
                React.createElement('span', { className: 'dropdown-wrapper', 'aria-hidden': false })),
                
                this.state.showInput ?
                React.createElement('span', { className: 'select2-container select2-container--default select2-container--open', style: { width: '100%' } },
                    React.createElement('span', { className: 'select2-dropdown select2-dropdown--below', dir: 'ltr' },
                        React.createElement('span', { className: 'select2-search select2-search--dropdown' },
                            React.createElement('input', { id: 'select2-search__field-' + this.props.name, className: 'select2-search__field', type: 'search', tabIndex: 0, autoComplete: 'off', autoCorrect: 'off', autoCapitalize: 'off', spellCheck: 'false', role: 'textbox', value: this.state.searchValue, onChange: this.onChangeSearchValue })),
                    React.createElement('span', { className: 'select2-results' },
                        React.createElement('ul', { className: 'select2-results__options', role: 'tree', 'aria-expanded': true, 'aria-hidden': false },
                        this.renderSearchResults()
                        ))
                    )) : null
                )
    }
}


var remoteSearchSelect2 = debounce(function (searchValue, ajax, updateSearchResults) {
    $.ajax({
        crossDomain: true,
        beforeSend: function (xhr) {
            ajax.beforeSend(xhr)
        },
        url: ajax.url,
        method: 'get',
        data: { q: searchValue }
    }).done(function (response, textStatus, jqXHR) {
        var results = ajax.done(response, textStatus, jqXHR)
        updateSearchResults(results)
    })
}, 1500)


function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
