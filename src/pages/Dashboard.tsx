
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, TrendingUp, TrendingDown, User, LogOut, Filter, BarChart3, ArrowUpDown, Grid3X3, List, Star, Coins, PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";
import { mockStocks } from "@/data/mockStocks";
import { Sparkline } from "@/components/Sparkline";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("symbol");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const sectors = ["All", ...Array.from(new Set(mockStocks.map(stock => stock.sector)))];
  const types = ["All", "stock", "gold", "mutual_fund"];
  
  const filteredAndSortedStocks = useMemo(() => {
    let filtered = mockStocks.filter(stock => {
      const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === "All" || stock.sector === selectedSector;
      const matchesType = selectedType === "All" || stock.type === selectedType;
      return matchesSearch && matchesSector && matchesType;
    });

    // Sort stocks
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedSector, selectedType, sortBy, sortOrder]);

  const paginatedStocks = filteredAndSortedStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedStocks.length / itemsPerPage);

  const marketOverview = {
    totalStocks: mockStocks.filter(s => s.type === 'stock').length,
    totalMFs: mockStocks.filter(s => s.type === 'mutual_fund').length,
    totalGold: mockStocks.filter(s => s.type === 'gold').length,
    gainers: mockStocks.filter(stock => stock.change > 0).length,
    losers: mockStocks.filter(stock => stock.change < 0).length,
    unchanged: mockStocks.filter(stock => stock.change === 0).length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stock':
        return <BarChart3 className="h-4 w-4" />;
      case 'gold':
        return <Coins className="h-4 w-4" />;
      case 'mutual_fund':
        return <PiggyBank className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'stock':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'mutual_fund':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StockPredict Pro
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              Live Market Data
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stocks</p>
                  <p className="text-2xl font-bold">{marketOverview.totalStocks.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mutual Funds</p>
                  <p className="text-2xl font-bold">{marketOverview.totalMFs.toLocaleString()}</p>
                </div>
                <PiggyBank className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gold</p>
                  <p className="text-2xl font-bold">{marketOverview.totalGold.toLocaleString()}</p>
                </div>
                <Coins className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gainers</p>
                  <p className="text-2xl font-bold text-green-600">{marketOverview.gainers}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Losers</p>
                  <p className="text-2xl font-bold text-red-600">{marketOverview.losers}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-gray-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unchanged</p>
                  <p className="text-2xl font-bold text-gray-600">{marketOverview.unchanged}</p>
                </div>
                <ArrowUpDown className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Market Explorer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search stocks, mutual funds, gold..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Asset Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Assets</SelectItem>
                    <SelectItem value="stock">Stocks</SelectItem>
                    <SelectItem value="mutual_fund">Mutual Funds</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="symbol">Symbol</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="changePercent">Change %</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="marketCap">Market Cap</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedStocks.length} of {filteredAndSortedStocks.length} assets
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Stock Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedStocks.map((stock) => (
              <Link key={stock.id} to={`/stock/${stock.symbol}`}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold text-primary truncate flex items-center gap-2">
                          {getTypeIcon(stock.type)}
                          {stock.symbol}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge className={getTypeBadgeColor(stock.type)}>
                          {stock.type === 'mutual_fund' ? 'MF' : stock.type}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Star className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs w-fit">
                      {stock.sector}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {stock.type === 'gold' ? '₹' : '$'}{stock.price.toLocaleString()}
                          {stock.type === 'gold' && <span className="text-sm text-muted-foreground">/10g</span>}
                        </p>
                        <div className="flex items-center space-x-1">
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              stock.change >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-16">
                      <Sparkline data={stock.sparklineData} />
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {stock.type === 'mutual_fund' ? 'AUM' : 'Vol'}: 
                        {stock.type === 'mutual_fund' 
                          ? ` ${stock.marketCap}` 
                          : ` ${(stock.volume / 1000000).toFixed(1)}M`}
                      </span>
                      {stock.type === 'stock' && <span>Cap: {stock.marketCap}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Volume/AUM</TableHead>
                  <TableHead>Market Cap</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Chart</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStocks.map((stock) => (
                  <TableRow key={stock.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(stock.type)}
                        <span className="font-bold text-primary">{stock.symbol}</span>
                        <Badge className={`text-xs ${getTypeBadgeColor(stock.type)}`}>
                          {stock.type === 'mutual_fund' ? 'MF' : stock.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{stock.name}</TableCell>
                    <TableCell className="font-semibold">
                      {stock.type === 'gold' ? '₹' : '$'}{stock.price.toLocaleString()}
                      {stock.type === 'gold' && <span className="text-xs text-muted-foreground">/10g</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`font-medium ${
                            stock.change >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {stock.type === 'mutual_fund' 
                        ? stock.marketCap 
                        : `${(stock.volume / 1000000).toFixed(1)}M`}
                    </TableCell>
                    <TableCell>{stock.type === 'stock' ? stock.marketCap : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{stock.sector}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-20">
                        <Sparkline data={stock.sparklineData} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/stock/${stock.symbol}`}>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {filteredAndSortedStocks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-lg font-semibold mb-2">No assets found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
