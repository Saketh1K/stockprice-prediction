
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, TrendingDown, Bookmark, BookmarkPlus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { mockStocks, generateHistoricalData, generatePredictionData } from "@/data/mockStocks";

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [predictionData, setPredictionData] = useState<any[]>([]);
  
  const stock = mockStocks.find(s => s.symbol === symbol);

  useEffect(() => {
    if (symbol) {
      setHistoricalData(generateHistoricalData(symbol));
      setPredictionData(generatePredictionData(symbol));
    }
  }, [symbol]);

  if (!stock) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Stock not found</h1>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const combinedData = [
    ...historicalData.map(d => ({ ...d, type: 'historical' })),
    ...predictionData.map(d => ({ ...d, type: 'prediction' }))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-2xl font-bold text-white">
            <span className="text-blue-400">Stock</span>Predict
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stock Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div>
                <h1 className="text-4xl font-bold text-white">{stock.symbol}</h1>
                <p className="text-xl text-slate-300">{stock.name}</p>
              </div>
              <Badge variant="outline" className="border-white/20 text-slate-300">
                {stock.sector}
              </Badge>
            </div>
            <Button
              onClick={() => setIsBookmarked(!isBookmarked)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {isBookmarked ? (
                <Bookmark className="h-4 w-4 mr-2 fill-current" />
              ) : (
                <BookmarkPlus className="h-4 w-4 mr-2" />
              )}
              {isBookmarked ? "Bookmarked" : "Add to Watchlist"}
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-slate-400 text-sm">Current Price</p>
                  <p className="text-3xl font-bold text-white">
                    ${stock.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Change</p>
                  <div className="flex items-center space-x-1">
                    {stock.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span
                      className={`text-xl font-bold ${
                        stock.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Volume</p>
                  <p className="text-xl font-bold text-white">
                    {(stock.volume / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Market Cap</p>
                  <p className="text-xl font-bold text-white">{stock.marketCap}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="historical" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
            <TabsTrigger value="historical" className="text-white data-[state=active]:bg-blue-600">
              Historical Data
            </TabsTrigger>
            <TabsTrigger value="predictions" className="text-white data-[state=active]:bg-blue-600">
              AI Predictions
            </TabsTrigger>
            <TabsTrigger value="combined" className="text-white data-[state=active]:bg-blue-600">
              Combined View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="historical">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">30-Day Historical Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#3B82F6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">7-Day AI Price Predictions</CardTitle>
                <p className="text-slate-400">
                  Based on LSTM neural network analysis
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={predictionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                        formatter={(value: any, name: string) => [
                          name === 'price' ? `$${value}` : `${(value * 100).toFixed(1)}%`,
                          name === 'price' ? 'Predicted Price' : 'Confidence'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#8B5CF6" 
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {predictionData.slice(0, 3).map((prediction, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <p className="text-slate-400 text-sm">
                          {new Date(prediction.date).toLocaleDateString()}
                        </p>
                        <p className="text-xl font-bold text-white">
                          ${prediction.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-blue-400">
                          {(prediction.confidence * 100).toFixed(1)}% confidence
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="combined">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Historical vs Predicted Prices</CardTitle>
                <p className="text-slate-400">
                  Blue line shows historical data, purple area shows AI predictions
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={false}
                        connectNulls={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StockDetail;
