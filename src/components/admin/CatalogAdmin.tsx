import React, { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ShoppingBag, 
  Tag, 
  CheckCircle2, 
  XCircle,
  X,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Save,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { deliveryRepository } from "@/repositories/deliveryRepository";
import { DeliveryZone } from "@/types/delivery";

import { ImageCropUpload } from "../ImageCropUpload";

interface CatalogAdminProps {
  merchantId: string;
  onBack: () => void;
}

export function CatalogAdmin({ merchantId, onBack }: CatalogAdminProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [showDelivery, setShowDelivery] = useState(false);
  const [editingZone, setEditingZone] = useState<Partial<DeliveryZone> | null>(null);

  useEffect(() => {
    setDeliveryZones(deliveryRepository.getByMerchant(merchantId));
  }, [merchantId]);

  const handleAddZone = () => {
    setEditingZone({
      merchantId,
      neighborhood: "",
      deliveryFee: 0,
      isActive: true,
      estimatedTime: "",
      minimumOrder: 0
    });
  };

  const handleSaveZone = () => {
    if (!editingZone?.neighborhood) {
      toast.error("Bairro é obrigatório");
      return;
    }
    const zoneToSave = {
      ...editingZone,
      id: editingZone.id || `zone-${Date.now()}`
    } as DeliveryZone;
    
    deliveryRepository.save(zoneToSave);
    setDeliveryZones(deliveryRepository.getByMerchant(merchantId));
    setEditingZone(null);
    toast.success("Zona de entrega salva");
  };

  const handleDeleteZone = (id: string) => {
    if (confirm("Excluir esta zona de entrega?")) {
      deliveryRepository.delete(id);
      setDeliveryZones(deliveryRepository.getByMerchant(merchantId));
      toast.success("Zona de entrega excluída");
    }
  };
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("axei_products") || "[]");
    setProducts(saved.filter((p: any) => p.merchantId === merchantId));
  }, [merchantId]);


  const saveProducts = (newProducts: Product[]) => {
    const allProducts = JSON.parse(localStorage.getItem("axei_products") || "[]");
    const otherMerchantsProducts = allProducts.filter((p: Product) => p.merchantId !== merchantId);
    const updated = [...otherMerchantsProducts, ...newProducts];
    localStorage.setItem("axei_products", JSON.stringify(updated));
    setProducts(newProducts);
  };

  const handleAddProduct = () => {
    setCurrentProduct({
      merchantId,
      name: "",
      description: "",
      price: 0,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
      category: "Geral",
      isPromotion: false,
      isAvailable: true,
    });
    setIsEditing(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      const updated = products.filter(p => p.id !== productId);
      saveProducts(updated);
      toast.success("Produto excluído com sucesso");
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    if (!currentProduct.name || !currentProduct.price) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }

    let updatedProducts: Product[];
    if (currentProduct.id) {
      updatedProducts = products.map(p => p.id === currentProduct.id ? (currentProduct as Product) : p);
      toast.success("Produto atualizado");
    } else {
      const newProduct = {
        ...currentProduct,
        id: `custom-${Date.now()}`,
      } as Product;
      updatedProducts = [...products, newProduct];
      toast.success("Produto adicionado");
    }

    saveProducts(updatedProducts);
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const toggleAvailability = (product: Product) => {
    const updated = products.map(p => 
      p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p
    );
    saveProducts(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
            Gestão do Comércio
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowDelivery(!showDelivery)}
            className="border-slate-200 font-black rounded-xl h-12 px-6"
          >
            <Truck className="w-5 h-5 mr-2 text-blue-600" />
            Entrega por Bairro
            {showDelivery ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
          </Button>
          <Button 
            onClick={handleAddProduct}
            className="bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl h-12 px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {showDelivery && (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Configurar Entregas
              </h3>
              <p className="text-sm text-slate-500 font-medium">Defina taxas por bairro e tempos estimados.</p>
            </div>
            {!editingZone && (
              <Button size="sm" onClick={handleAddZone} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Novo Bairro
              </Button>
            )}
          </div>

          {editingZone && (
            <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Bairro</label>
                  <Input 
                    value={editingZone.neighborhood}
                    onChange={e => setEditingZone({...editingZone, neighborhood: e.target.value})}
                    placeholder="Ex: Centro"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Taxa (R$)</label>
                  <Input 
                    type="number"
                    value={editingZone.deliveryFee}
                    onChange={e => setEditingZone({...editingZone, deliveryFee: parseFloat(e.target.value)})}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Pedido Mínimo (R$)</label>
                  <Input 
                    type="number"
                    value={editingZone.minimumOrder}
                    onChange={e => setEditingZone({...editingZone, minimumOrder: parseFloat(e.target.value)})}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Tempo Estimado</label>
                  <Input 
                    value={editingZone.estimatedTime}
                    onChange={e => setEditingZone({...editingZone, estimatedTime: e.target.value})}
                    placeholder="Ex: 30-45 min"
                    className="rounded-xl"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editingZone.isActive}
                      onChange={e => setEditingZone({...editingZone, isActive: e.target.checked})}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600"
                    />
                    <span className="text-sm font-bold text-slate-700">Ativo para entrega</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveZone} className="bg-slate-900 text-white font-black rounded-xl px-6">
                  <Save className="w-4 h-4 mr-2" /> Salvar Zona
                </Button>
                <Button variant="outline" onClick={() => setEditingZone(null)} className="rounded-xl font-black">
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveryZones.map(zone => (
              <div key={zone.id} className={cn(
                "p-4 rounded-2xl border transition-all",
                zone.isActive ? "bg-white border-slate-100 shadow-sm" : "bg-slate-50 border-slate-200 opacity-60"
              )}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-black text-slate-900">{zone.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditingZone(zone)} className="h-8 w-8 text-slate-400 hover:text-blue-600">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteZone(zone.id)} className="h-8 w-8 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-bold flex items-center gap-1"><DollarSign className="w-3 h-3" /> Taxa</span>
                    <span className="font-black text-slate-900">R$ {zone.deliveryFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {zone.minimumOrder > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-bold">Mínimo</span>
                      <span className="font-bold text-slate-900">R$ {zone.minimumOrder.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  {zone.estimatedTime && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Tempo</span>
                      <span className="font-bold text-slate-900">{zone.estimatedTime}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {deliveryZones.length === 0 && !editingZone && (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
              <Truck className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 font-bold text-sm">Nenhuma zona de entrega configurada.</p>
              <Button variant="link" onClick={handleAddZone} className="text-blue-600 font-black uppercase text-xs">Adicionar Primeiro Bairro</Button>
            </div>
          )}
        </div>
      )}


      {isEditing && currentProduct && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Nome do Produto</label>
                <Input 
                  value={currentProduct.name}
                  onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                  placeholder="Ex: Pizza Margherita"
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Descrição</label>
                <Textarea 
                  value={currentProduct.description}
                  onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  placeholder="Breve descrição dos ingredientes ou detalhes..."
                  className="rounded-xl border-slate-200 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Preço (R$)</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={currentProduct.price}
                    onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">Categoria</label>
                  <Input 
                    value={currentProduct.category}
                    onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                    placeholder="Ex: Lanches, Pizzas..."
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="md:col-span-2">
                <ImageCropUpload
                  label="Imagem do Produto"
                  description="Use uma imagem clara que destaque o produto"
                  recommendedSize="1080x1080 px • 1:1"
                  aspectRatio={1}
                  value={currentProduct.image || ""}
                  onChange={base64 => setCurrentProduct({...currentProduct, image: base64})}
                />
              </div>

              <div className="flex items-center gap-6 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={currentProduct.isPromotion}
                    onChange={e => setCurrentProduct({...currentProduct, isPromotion: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-bold text-slate-700">Em Promoção</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={currentProduct.isAvailable}
                    onChange={e => setCurrentProduct({...currentProduct, isAvailable: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-bold text-slate-700">Disponível</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit"
                  className="flex-1 h-12 bg-slate-900 text-white font-black rounded-xl hover:bg-black"
                >
                  Salvar Produto
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="h-12 border-slate-200 text-slate-600 font-black rounded-xl"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Seu catálogo está vazio</h3>
          <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
            Adicione seus primeiros produtos para permitir que seus clientes façam pedidos diretamente pelo WhatsApp.
          </p>
          <Button 
            onClick={handleAddProduct}
            variant="outline"
            className="rounded-xl border-slate-200 font-black h-12 px-6"
          >
            Começar Agora
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className={cn(
              "bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex gap-4 transition-all hover:shadow-md",
              !product.isAvailable && "opacity-75"
            )}>
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{product.category}</span>
                    <h4 className="font-black text-slate-900 truncate">{product.name}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {product.isPromotion && <Tag className="w-3.5 h-3.5 text-orange-600" />}
                    {product.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  </div>
                </div>
                <p className="text-lg font-black text-slate-900 mt-1">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleEditProduct(product)}
                    className="h-8 px-3 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:text-orange-600 hover:bg-orange-50"
                  >
                    <Edit3 className="w-3 h-3 mr-1" /> Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => toggleAvailability(product)}
                    className={cn(
                      "h-8 px-3 rounded-lg text-[10px] font-black uppercase",
                      product.isAvailable ? "text-emerald-600 hover:bg-emerald-50" : "text-amber-600 hover:bg-amber-50"
                    )}
                  >
                    {product.isAvailable ? "Pausar" : "Ativar"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="h-8 px-3 rounded-lg text-[10px] font-black uppercase text-slate-300 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
