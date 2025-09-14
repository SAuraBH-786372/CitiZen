import { useMemo, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/api'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Search, MapPin, Upload, Camera, X } from 'lucide-react'
import LeafletMapPicker from '@/components/leaflet-map-picker'
import ConfettiSuccess from '@/components/confetti-success'

const CATEGORIES = [
  'Roads',
  'Potholes',
  'Electricity',
  'Garbage/Sanitation',
  'Water Supply',
  'Public Transport',
  'Parks & Public Spaces',
  'Other'
]

type Mode = 'map' | 'address' | 'coords'

export default function ReportIssue() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [image, setImage] = useState<File | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState('')
  const [mode, setMode] = useState<Mode>('map')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const latStr = useMemo(() => (coords ? String(coords.lat) : ''), [coords])
  const lngStr = useMemo(() => (coords ? String(coords.lng) : ''), [coords])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Log all values to console (including coordinates + image)
    console.log('Report Issue Submit', {
      title,
      description,
      category,
      coords,
      address,
      image: image ? { name: image.name, size: image.size, type: image.type } : null
    })

    setLoading(true)
    try {
      const form = new FormData()
      form.append('title', title)
      form.append('description', description)
      form.append('category', category)
      if (address) form.append('address', address)
      if (!coords) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
        form.append('lat', String(pos.coords.latitude))
        form.append('lng', String(pos.coords.longitude))
      } else {
        form.append('lat', String(coords.lat))
        form.append('lng', String(coords.lng))
      }
      if (image) form.append('image', image)
      await api.post('/issues', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Issue reported')
      setSuccess(true)
      setTitle(''); setDescription(''); setImage(null); setCoords(null); setAddress(''); setMode('map')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to report issue')
    } finally { setLoading(false) }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) setImage(f)
  }

  const setCoordValue = (key: 'lat'|'lng', value: string) => {
    const num = Number(value)
    if (Number.isNaN(num)) return
    const next = { lat: key === 'lat' ? num : (coords?.lat ?? 0), lng: key === 'lng' ? num : (coords?.lng ?? 0) }
    setCoords(next)
  }

  // Location search with geocoding
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    setSearchLoading(true)
    try {
      // Using Nominatim (OpenStreetMap) for geocoding - free and no API key required
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      )
      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error('Geocoding error:', error)
      toast.error('Failed to search location')
    } finally {
      setSearchLoading(false)
    }
  }, [])

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    setCoords({ lat, lng })
    setAddress(result.display_name)
    setSearchQuery(result.display_name)
    setSearchResults([])
    setMode('map') // Switch to map view to show selected location
  }

  return (
    <>
      <ConfettiSuccess show={success} />
      <div className="w-full flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Report an Issue</CardTitle>
            <CardDescription>Provide details and location to help officials respond quickly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={submit} onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}>
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="text-sm font-medium block mb-2">Issue Title</label>
                <Input
                  placeholder="e.g. Broken streetlight near main road"
                  value={title}
                  onChange={e=>setTitle(e.target.value)}
                  required
                  className="text-base"
                />
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="text-sm font-medium block mb-2">Description</label>
                <Textarea
                  placeholder="Describe the issue in detail. What exactly is wrong? When did you notice it?"
                  value={description}
                  onChange={e=>setDescription(e.target.value)}
                  required
                  rows={4}
                  className="text-base resize-none"
                />
              </motion.div>

              {/* Category */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="text-sm font-medium block mb-2">Category</label>
                <Select value={category} onChange={e=>setCategory(e.target.value)} className="text-base">
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </motion.div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Location
                </label>

                {/* Location Search Bar */}
                <div className="relative mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search for a location (e.g., Main Street, City Hall, etc.)"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        searchLocation(e.target.value)
                      }}
                      className="pl-10 pr-4"
                    />
                    {searchLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSearchResult(result)}
                          className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
                        >
                          <div className="font-medium text-sm">{result.display_name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {result.type} • {result.lat}, {result.lon}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mode Toggle */}
                <div className="inline-flex mb-3 rounded-md border overflow-hidden">
                  {([
                    { key: 'map', label: 'Map', icon: MapPin },
                    { key: 'address', label: 'Address', icon: Search },
                    { key: 'coords', label: 'Coordinates', icon: MapPin }
                  ] as { key: Mode; label: string; icon: any }[]).map(t => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setMode(t.key)}
                      className={`px-3 py-2 text-sm flex items-center gap-2 ${mode===t.key ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'} border-r last:border-r-0 transition-colors`}
                      aria-pressed={mode===t.key}
                    >
                      <t.icon className="w-4 h-4" />
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Map Mode */}
                {mode === 'map' && (
                  <div>
                    <LeafletMapPicker value={coords} onChange={setCoords} />
                  </div>
                )}

                {/* Address Mode */}
                {mode === 'address' && (
                  <div>
                    <Input
                      placeholder="Type address or landmark"
                      value={address}
                      onChange={e=>setAddress(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Address is stored with the form; coordinates still required for submission.</p>
                  </div>
                )}

                {/* Coordinates Mode */}
                {mode === 'coords' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Latitude</label>
                      <Input
                        type="number"
                        step="any"
                        value={latStr}
                        onChange={e=>setCoordValue('lat', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Longitude</label>
                      <Input
                        type="number"
                        step="any"
                        value={lngStr}
                        onChange={e=>setCoordValue('lng', e.target.value)}
                      />
                    </div>
                    {/* Show mini map for context when editing coords */}
                    <div className="sm:col-span-2">
                      <LeafletMapPicker value={coords} onChange={setCoords} />
                    </div>
                  </div>
                )}

                {/* Live coordinates */}
                {coords && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Lat {coords.lat.toFixed(6)}, Lng {coords.lng.toFixed(6)}
                  </p>
                )}

                {/* Hidden inputs for coordinates */}
                <input type="hidden" name="lat" value={coords ? String(coords.lat) : ''} />
                <input type="hidden" name="lng" value={coords ? String(coords.lng) : ''} />
              </div>

              {/* Image */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  <Camera className="inline w-4 h-4 mr-1" />
                  Photo Evidence
                </label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                  {!image ? (
                    <div>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Drag and drop an image here, or click to browse
                      </p>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={e=>setImage(e.target.files?.[0] || null)} 
                        className="max-w-xs mx-auto" 
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt="Issue preview" 
                        className="h-48 w-full object-cover rounded-lg border mb-3" 
                      />
                      <Badge variant="secondary" className="mb-2">
                        {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
                      </Badge>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setImage(null)}
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button disabled={loading} variant="success" size="lg" className="w-full">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Issue...
                    </div>
                  ) : (
                    'Submit Issue Report'
                  )}
                </Button>
              </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  </>
)
}